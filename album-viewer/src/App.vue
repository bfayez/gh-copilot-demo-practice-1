<template>
  <div class="app">
    <header class="header">
      <h1>🎵 Album Collection</h1>
      <p>Discover amazing music albums</p>
    </header>

    <main class="main">
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Loading albums...</p>
      </div>

      <div v-else-if="error" class="error">
        <p>{{ error }}</p>
        <button @click="fetchAlbums" class="retry-btn">Try Again</button>
      </div>

      <div v-else>
        <section v-if="albums.length" class="price-chart-section">
          <h2>Price comparison</h2>
          <div ref="priceChart" class="price-chart"></div>
        </section>

        <div class="albums-grid">
          <AlbumCard
            v-for="album in albums"
            :key="album.id"
            :album="album"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import axios from 'axios'
import AlbumCard from './components/AlbumCard.vue'
import type { Album } from './types/album'
import { renderAlbumPriceChart } from './utils/viz'

const albums = ref<Album[]>([])
const loading = ref<boolean>(true)
const error = ref<string | null>(null)
const priceChart = ref<HTMLElement | null>(null)
let resizeObserver: ResizeObserver | undefined

const drawPriceChart = (): void => {
  if (priceChart.value) {
    renderAlbumPriceChart(priceChart.value, albums.value)
  }
}

// Function to fetch albums from the API
const fetchAlbums = async (): Promise<void> => {
  try {
    loading.value = true
    error.value = null
    const response = await axios.get<Album[]>('/albums')
    albums.value = response.data
  } catch (err) {
    error.value = 'Failed to load albums. Please make sure the API is running.'
    console.error('Error fetching albums:', err)
  } finally {
    loading.value = false
  }

  await nextTick()
  drawPriceChart()
  if (priceChart.value) {
    resizeObserver?.observe(priceChart.value)
  }
}

onMounted(() => {
  resizeObserver = new ResizeObserver(drawPriceChart)
  fetchAlbums()
})

onBeforeUnmount(() => resizeObserver?.disconnect())
</script>

<style scoped>
.app {
  min-height: 100vh;
  padding: 2rem;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
  color: white;
}

.header h1 {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.header p {
  font-size: 1.2rem;
  opacity: 0.9;
}

.main {
  max-width: 1200px;
  margin: 0 auto;
}

.price-chart-section {
  margin: 0 1rem 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
}

.price-chart-section h2 {
  margin: 0 0 0.75rem;
  color: #222;
  font-size: 1.25rem;
}

.price-chart {
  width: 100%;
  overflow-x: auto;
}

.price-chart :deep(svg) {
  display: block;
  min-width: 560px;
  font-family: inherit;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  color: white;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
  text-align: center;
  padding: 4rem;
  color: white;
}

.error p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.retry-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
  padding: 0.75rem 2rem;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  background: white;
  color: #667eea;
}

.albums-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding: 1rem;
}

@media (max-width: 768px) {
  .app {
    padding: 1rem;
  }
  
  .header h1 {
    font-size: 2rem;
  }
  
  .albums-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>
