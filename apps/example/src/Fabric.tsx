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

	const image = new Image(100, 100)
	image.src = 'https://pic4.zhimg.com/v2-4a7eaf6424506820f2271cff7944c89f_r.jpg'
	image.crossOrigin = 'anonymous'

	return (
		<>
			<Canvas options={{ fill: 'red', selection: true }}>
				<f-circle
					width={100}
					height={100}
					radius={radius}
					fill="red"
					borderColor="transparent"
					onMoving={(e: any) => {
						console.log(e)
					}}
				/>
				<f-rect width={100} height={100} fill={fill} />
				<f-text width={100} height={100} args={['hello']} />
				<f-textbox width={100} height={100} args={['hello world']} />
				<f-image args={[image]} left={100} top={10} width={300} height={100} />
			</Canvas>
			<div>
				<button onClick={() => setRadius(radius + 10)}>{radius}</button>
				<button onClick={() => changeFillColor()}>{fill}</button>
			</div>
		</>
	)
}
