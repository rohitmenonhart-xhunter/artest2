import { GLTFLoader} from "./libs/GLTFLoader.js";
const THREE = window.MINDAR.IMAGE.THREE;
import {loadGLTF, loadAudio} from "./libs/loader.js";

document.addEventListener('DOMContentLoaded', () => {
	const start = async() => {
		const mindarThree = new window.MINDAR.IMAGE.MindARThree({
			container: document.body,
			imageTargetSrc: './abcd.mind',
			maxTrack: 4,
		});
		
		const {renderer, scene, camera} = mindarThree;
		
		const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
		scene.add(light);
		
		// Create texture loader for loading images
		const textureLoader = new THREE.TextureLoader();
		
		// Create planes with images for airplane
		const topPlaneGeometry = new THREE.PlaneGeometry(1, 1); // Adjust size as needed
		const bottomPlaneGeometry = new THREE.PlaneGeometry(1, 1);
		
		// Load textures for the planes - replace with your image paths
		const topTexture = textureLoader.load('./images/c.jpg'); // Replace with your top image
		const bottomTexture = textureLoader.load('./images/d.jpg'); // Replace with your bottom image
		
		const topPlaneMaterial = new THREE.MeshBasicMaterial({map: topTexture, transparent: true});
		const bottomPlaneMaterial = new THREE.MeshBasicMaterial({map: bottomTexture, transparent: true});
		
		const topPlane = new THREE.Mesh(topPlaneGeometry, topPlaneMaterial);
		const bottomPlane = new THREE.Mesh(bottomPlaneGeometry, bottomPlaneMaterial);
		
		// Position the planes
		topPlane.position.set(0, 1, 0); // Adjust Y value to position above model
		bottomPlane.position.set(0, -1, 0); // Adjust Y value to position below model
		
		const airplane = await loadGLTF("./airplane/scene.gltf");
		airplane.scene.scale.set(0.5, 0.5, 0.5);
		
		const airplaneMixer = new THREE.AnimationMixer(airplane.scene);
		const airplaneAction = airplaneMixer.clipAction(airplane.animations[0]);
		airplaneAction.play();
		// calling airplaneClip and we are loading the audio from our hard disk
		const airplaneAclip = await loadAudio("./sound/airplane.mp3");
		// we instantiated the THREE listener component using airListener variable
		const airListener = new THREE.AudioListener();
		// instantiated a speaker positional audio as airplaneAudio
		const airplaneAudio = new THREE.PositionalAudio(airListener);	
		
		
		const ball = await loadGLTF("./ball/scene.gltf");
		ball.scene.scale.set(0.2, 0.2, 0.2);
		
		const ballMixer = new THREE.AnimationMixer(ball.scene);
		const ballAction = ballMixer.clipAction(ball.animations[0]);
		ballAction.play();
		
		const ballAclip = await loadAudio("./sound/ball.mp3");
		const ballListener = new THREE.AudioListener();
		const ballAudio = new THREE.PositionalAudio(ballListener);	
		
		const car = await loadGLTF("./car/scene.gltf");
		car.scene.scale.set(0.3, 0.3, 0.3);
		car.scene.position.set(0, -0.1, 0);
		
		const carMixer = new THREE.AnimationMixer(car.scene);
		const carAction = carMixer.clipAction(car.animations[0]);
		carAction.play();
		
		const carAclip = await loadAudio("./sound/car.mp3");
		const carListener = new THREE.AudioListener();
		const carAudio = new THREE.PositionalAudio(carListener);	
		
		const dog = await loadGLTF("./dog/scene.gltf");
		dog.scene.scale.set(0.5, 0.5, 0.5);

		const dogMixer = new THREE.AnimationMixer(dog.scene);
		const dogAction = dogMixer.clipAction(dog.animations[0]);
		dogAction.play();



		const airplaneAnchor = mindarThree.addAnchor(0);
		airplaneAnchor.group.add(airplane.scene);
		// Add the planes to the anchor group
		airplaneAnchor.group.add(topPlane);
		airplaneAnchor.group.add(bottomPlane);
		// added listener to the camera
		camera.add(airListener);
		// we set the referal distance from which the audio should fade out
		airplaneAudio.setRefDistance(100);
		// set the buffer of audio to stream
		airplaneAudio.setBuffer(airplaneAclip);
		// we sset the audio to loop
		airplaneAudio.setLoop(true);
		// we added the audio to the anchor of airplane which will be activated on seeing  the airplane image
		airplaneAnchor.group.add(airplaneAudio)
		
		// make airplane audio play only when the target of airplane image is detected
		airplaneAnchor.onTargetFound = () => {
			airplaneAudio.play();
		}
		// make airplane audio pause then the target image is lost in the camera
		airplaneAnchor.onTargetLost = () => {
			airplaneAudio.pause();
		}
		
		
		const ballAnchor = mindarThree.addAnchor(1);
		ballAnchor.group.add(ball.scene);
		
		camera.add(ballListener);
		ballAudio.setRefDistance(100);
		ballAudio.setBuffer(ballAclip);
		ballAudio.setLoop(true);
		ballAnchor.group.add(ballAudio)
		ballAnchor.onTargetFound = () => {
			ballAudio.play();
		}
		ballAnchor.onTargetLost = () => {
			ballAudio.pause();
		}
		
		
		const carAnchor = mindarThree.addAnchor(2);
		carAnchor.group.add(car.scene);
		
		camera.add(carListener);
		carAudio.setRefDistance(100);
		carAudio.setBuffer(carAclip);
		carAudio.setLoop(true);
		carAnchor.group.add(carAudio)
		carAnchor.onTargetFound = () => {
			carAudio.play();
		}
		carAnchor.onTargetLost = () => {
			carAudio.pause();
		}
		
		const dogAnchor = mindarThree.addAnchor(3);
		dogAnchor.group.add(dog.scene);


		const clock = new THREE.Clock();
		
		
		await mindarThree.start();		
		
		renderer.setAnimationLoop(() => {
			const delta = clock.getDelta();
			airplaneMixer.update(delta);
			ballMixer.update(delta);
			carMixer.update(delta);
			car.scene.rotation.set(0, car.scene.rotation.y + delta, 0);
			dogMixer.update(delta);
			renderer.render(scene, camera);
		});
	}
	start();
	
});
