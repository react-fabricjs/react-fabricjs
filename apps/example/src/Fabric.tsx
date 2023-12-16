import { Canvas } from '@react-fabricjs/fiber'
import { useState } from 'react'

export function Fabric() {
	const [radius, setRadius] = useState(50)

	const [fill, setFill] = useState('red')
	function changeFillColor() {
		const colorList = ['blue', 'green', 'black', 'pink']
		const index = Math.floor(Math.random() * colorList.length)
		setFill(colorList[index])
	}

	return (
		<>
			<Canvas options={{ fill: 'red', selection: true }}>
				<f-circle width={100} height={100} radius={radius} fill="red" borderColor="transparent" />
				<f-rect width={100} height={100} fill={fill} />
			</Canvas>
			<div>
				<button onClick={() => setRadius(radius + 10)}>{radius}</button>
				<button onClick={() => changeFillColor()}>{fill}</button>
			</div>
		</>
	)
}
