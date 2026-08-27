param location string = resourceGroup().location
param uniqueSeed string = '${subscription().subscriptionId}-${resourceGroup().name}'
param uniqueSuffix string = 'da-${uniqueString(uniqueSeed)}'
param containerAppsEnvName string = 'env-${uniqueSuffix}'
param logAnalyticsWorkspaceName string = 'log-${uniqueSuffix}'
param appInsightsName string = 'appinsights-${uniqueSuffix}'
param storageAccountName string = 'storage${replace(uniqueSuffix, '-', '')}'
param blobContainerName string = 'albums'
param registryName string
param apiImage string
param viewerImage string
param openAiAccountName string = 'openai-${uniqueSuffix}'


// Log analytics and App Insights for visibility 
resource logAnalyticsWorkspace 'Microsoft.OperationalInsights/workspaces@2020-03-01-preview' = {
  name: logAnalyticsWorkspaceName
  location: location
  properties: any({
    retentionInDays: 30
    features: {
      searchVersion: 1
    }
    sku: {
      name: 'PerGB2018'
    }
  })
}

resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: appInsightsName
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId:logAnalyticsWorkspace.id
  }
}

// Storage Account to act as state store 
resource storageAccount 'Microsoft.Storage/storageAccounts@2021-06-01' = {
  name: storageAccountName
  location: location
  kind: 'StorageV2'
  sku: {
    name: 'Standard_LRS'
  }
}

resource blobService 'Microsoft.Storage/storageAccounts/blobServices@2021-06-01' = {
  parent: storageAccount
  name: 'default'
}

resource blobContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2021-06-01' = {
  parent: blobService
  name: blobContainerName
}

resource containerRegistry 'Microsoft.ContainerRegistry/registries@2023-07-01' = {
  name: registryName
  location: location
  sku: {
    name: 'Basic'
  }
  properties: {
    adminUserEnabled: true
    publicNetworkAccess: 'Enabled'
  }
}

resource openAiAccount 'Microsoft.CognitiveServices/accounts@2024-10-01' = {
  name: openAiAccountName
  location: location
  kind: 'OpenAI'
  identity: {
    type: 'SystemAssigned'
  }
  sku: {
    name: 'S0'
  }
  properties: {
    customSubDomainName: openAiAccountName
    disableLocalAuth: true
    publicNetworkAccess: 'Enabled'
  }
}

// Container Apps environment 
resource containerAppsEnv 'Microsoft.App/managedEnvironments@2022-03-01' = {
  name: containerAppsEnvName
  location: location
  properties: {
    daprAIInstrumentationKey:appInsights.properties.InstrumentationKey
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: logAnalyticsWorkspace.properties.customerId
        sharedKey: logAnalyticsWorkspace.listKeys().primarySharedKey
      }
    }
  }
}

module daprStateStore 'modules/dapr-statestore.bicep' = {
  name: '${deployment().name}--dapr-statestore'
  dependsOn:[
    storageAccount
    containerAppsEnv
  ]
  params: {
    containerAppsEnvName : containerAppsEnvName
    storage_account_name: storageAccountName
    storage_container_name: blobContainerName
}
}

module albumViewerCapp 'modules/container-app.bicep' = {
  name: '${deployment().name}--album-viewer'
  dependsOn: [
    containerAppsEnv
    albumServiceCapp
  ]
  params: {
    location: location
    containerAppsEnvName: containerAppsEnvName
    appName: 'album-viewer'
    registryPassword: containerRegistry.listCredentials().passwords[0].value
    registryUsername: containerRegistry.listCredentials().username
    containerImage: viewerImage
    httpPort: 3000
    registryServer: registryName
  }
}

module albumServiceCapp 'modules/container-app.bicep' = {
  name: '${deployment().name}--album-api'
  dependsOn: [
    containerAppsEnv
  ]
  params: {
    location: location
    containerAppsEnvName: containerAppsEnvName
    appName: 'album-api'
    registryPassword: containerRegistry.listCredentials().passwords[0].value
    registryUsername: containerRegistry.listCredentials().username
    containerImage: apiImage
    httpPort: 80
    registryServer: registryName
  }
}

output env array=[
  'Environment name: ${containerAppsEnv.name}'
  'Storage account name: ${storageAccount.name}'
  'Storage container name: ${blobContainer.name}'
  'Container registry: ${containerRegistry.properties.loginServer}'
  'Azure OpenAI endpoint: ${openAiAccount.properties.endpoint}'
]

