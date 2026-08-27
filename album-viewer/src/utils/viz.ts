import * as d3 from 'd3'
import type { Album } from '../types/album'

export function renderAlbumPriceChart(container: HTMLElement, albums: Album[]): void {
	const width = Math.max(container.clientWidth, 320)
	const rowHeight = 42
	const margin = { top: 16, right: 56, bottom: 40, left: 150 }
	const height = margin.top + margin.bottom + albums.length * rowHeight

	d3.select(container).selectAll('*').remove()

	const svg = d3.select(container)
		.append('svg')
		.attr('viewBox', `0 0 ${width} ${height}`)
		.attr('role', 'img')
		.attr('aria-label', 'Album prices')

	const chart = svg.append('g')
		.attr('transform', `translate(${margin.left},${margin.top})`)

	const chartWidth = width - margin.left - margin.right
	const chartHeight = albums.length * rowHeight
	const maximumPrice = d3.max(albums, album => album.price) ?? 0
	const x = d3.scaleLinear()
		.domain([0, maximumPrice])
		.nice()
		.range([0, chartWidth])
	const y = d3.scaleBand()
		.domain(albums.map(album => album.title))
		.range([0, chartHeight])
		.padding(0.25)

	chart.append('g')
		.call(d3.axisLeft(y).tickSize(0))
		.call(axis => axis.select('.domain').remove())

	chart.selectAll('rect')
		.data(albums)
		.join('rect')
		.attr('x', 0)
		.attr('y', album => y(album.title) ?? 0)
		.attr('width', album => x(album.price))
		.attr('height', y.bandwidth())
		.attr('rx', 3)
		.attr('fill', '#167d8d')

	chart.selectAll('.price-label')
		.data(albums)
		.join('text')
		.attr('class', 'price-label')
		.attr('x', album => x(album.price) + 8)
		.attr('y', album => (y(album.title) ?? 0) + y.bandwidth() / 2)
		.attr('dominant-baseline', 'middle')
		.text(album => `$${album.price.toFixed(2)}`)

	chart.append('g')
		.attr('transform', `translate(0,${chartHeight})`)
		.call(d3.axisBottom(x).ticks(5).tickFormat(value => `$${value}`))
}

