import { Canvas } from '@react-fabricjs/fiber'
import { useState } from 'react'

export function Fabric() {
	const [radius, setRadius] = useState(50)
	return (
		<>
			<Canvas options={{ fill: 'red', selection: true }}>
				<f-circle width={100} height={100} radius={radius} fill="red" borderColor="transparent" />
				<f-rect width={100} height={100} fill="blue" />
			</Canvas>
			<div>
				<button onClick={() => setRadius(radius + 10)}>{radius}</button>
			</div>
		</>
	)
}
