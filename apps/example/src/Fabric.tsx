import { Canvas } from '@react-fabricjs/fiber'

export function Fabric() {
	return (
		<Canvas>
			<f-circle
				width={100}
				height={100}
				radius={50}
				backgroundColor="red"
				borderColor="transparent"
			/>
		</Canvas>
	)
}
