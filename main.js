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
		const topPlaneGeometry = new THREE.PlaneGeometry(1, 1);
		
		// Load textures for the planes
		const topTexture = textureLoader.load('./images/c.jpg');
		
		// Load icon textures
		const phoneIconTexture = textureLoader.load('./images/phone.png');
		const emailIconTexture = textureLoader.load('./images/email.png');
		const webIconTexture = textureLoader.load('./images/web.png');
		const arrowTexture = textureLoader.load('./images/arrow.png');
		
		// Create materials for icons
		const phoneMaterial = new THREE.MeshBasicMaterial({map: phoneIconTexture, transparent: true});
		const emailMaterial = new THREE.MeshBasicMaterial({map: emailIconTexture, transparent: true});
		const webMaterial = new THREE.MeshBasicMaterial({map: webIconTexture, transparent: true});
		const arrowMaterial = new THREE.MeshBasicMaterial({map: arrowTexture, transparent: true});
		
		// Create icon planes (smaller size for icons)
		const iconGeometry = new THREE.PlaneGeometry(0.3, 0.3);
		const phoneIcon = new THREE.Mesh(iconGeometry, phoneMaterial);
		const emailIcon = new THREE.Mesh(iconGeometry, emailMaterial);
		const webIcon = new THREE.Mesh(iconGeometry, webMaterial);
		
		// Create arrow
		const arrowGeometry = new THREE.PlaneGeometry(0.4, 0.4);
		const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
		
		// Position icons at the bottom (starting positions will be higher for intro animation)
		phoneIcon.position.set(-0.4, 2, 0); // Start from above
		emailIcon.position.set(0, 2, 0);    // Start from above
		webIcon.position.set(0.4, 2, 0);    // Start from above
		arrow.position.set(0, 2, 0);        // Start from above

		// Set initial scale to 0 for intro animation
		phoneIcon.scale.set(0, 0, 0);
		emailIcon.scale.set(0, 0, 0);
		webIcon.scale.set(0, 0, 0);
		arrow.scale.set(0, 0, 0);

		// Animation timing variables
		let startTime = Date.now();
		const introDuration = 1000;
		const staggerDelay = 200;

		// Reset function for animations
		const resetAnimations = () => {
			startTime = Date.now();
			// Reset positions and scales
			phoneIcon.position.set(-0.4, 2, 0);
			emailIcon.position.set(0, 2, 0);
			webIcon.position.set(0.4, 2, 0);
			arrow.position.set(0, 2, 0);

			phoneIcon.scale.set(0, 0, 0);
			emailIcon.scale.set(0, 0, 0);
			webIcon.scale.set(0, 0, 0);
			arrow.scale.set(0, 0, 0);
		};

		// Final positions
		const finalPositions = {
			arrow: -0.4,
			phone: -0.8,
			email: -0.8,
			
			web: -0.8
		};

		// Animate the arrow and icons
		const animateIntro = () => {
			const currentTime = Date.now();
			const elapsedTime = currentTime - startTime;

			// Animate arrow
			if (elapsedTime > 0) {
				const arrowProgress = Math.min(1, elapsedTime / introDuration);
				arrow.position.y = 2 + (finalPositions.arrow - 2) * easeOutBack(arrowProgress);
				arrow.scale.set(
					easeOutBack(arrowProgress),
					easeOutBack(arrowProgress),
					easeOutBack(arrowProgress)
				);
			}

			// Animate phone icon
			if (elapsedTime > staggerDelay) {
				const phoneProgress = Math.min(1, (elapsedTime - staggerDelay) / introDuration);
				phoneIcon.position.y = 2 + (finalPositions.phone - 2) * easeOutBack(phoneProgress);
				phoneIcon.scale.set(
					easeOutBack(phoneProgress),
					easeOutBack(phoneProgress),
					easeOutBack(phoneProgress)
				);
			}

			// Animate email icon
			if (elapsedTime > staggerDelay * 2) {
				const emailProgress = Math.min(1, (elapsedTime - staggerDelay * 2) / introDuration);
				emailIcon.position.y = 2 + (finalPositions.email - 2) * easeOutBack(emailProgress);
				emailIcon.scale.set(
					easeOutBack(emailProgress),
					easeOutBack(emailProgress),
					easeOutBack(emailProgress)
				);
			}

			// Animate web icon
			if (elapsedTime > staggerDelay * 3) {
				const webProgress = Math.min(1, (elapsedTime - staggerDelay * 3) / introDuration);
				webIcon.position.y = 2 + (finalPositions.web - 2) * easeOutBack(webProgress);
				webIcon.scale.set(
					easeOutBack(webProgress),
					easeOutBack(webProgress),
					easeOutBack(webProgress)
				);
			}
		};

		// Easing function for smooth animation
		const easeOutBack = (x) => {
			const c1 = 1.70158;
			const c3 = c1 + 1;
			return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
		};

		// Continuous arrow hover animation
		const animateArrowHover = () => {
			arrow.position.y = finalPositions.arrow + Math.sin(Date.now() * 0.003) * 0.1;
			arrow.rotation.z = Math.sin(Date.now() * 0.002) * 0.1;
		};

		// Make icons interactive
		const raycaster = new THREE.Raycaster();
		const mouse = new THREE.Vector2();
		
		// Function to handle both click and touch
		const handleInteraction = (event) => {
			// Prevent default behavior
			event.preventDefault();
			
			// Get the correct coordinates whether it's touch or click
			const x = event.clientX || (event.touches && event.touches[0].clientX);
			const y = event.clientY || (event.touches && event.touches[0].clientY);
			
			if (x === undefined || y === undefined) return;
			
			// Calculate mouse position in normalized device coordinates
			mouse.x = (x / window.innerWidth) * 2 - 1;
			mouse.y = -(y / window.innerHeight) * 2 + 1;
			
			// Update the picking ray with the camera and mouse position
			raycaster.setFromCamera(mouse, camera);
			
			// Calculate objects intersecting the picking ray
			const intersects = raycaster.intersectObjects([phoneIcon, emailIcon, webIcon]);
			
			if (intersects.length > 0) {
				const clickedIcon = intersects[0].object;
				if (clickedIcon === phoneIcon) {
					window.location.href = 'tel:+1234567890';
				} else if (clickedIcon === emailIcon) {
					window.location.href = 'mailto:example@email.com';
				} else if (clickedIcon === webIcon) {
					// Add timestamp to prevent caching
					const timestamp = new Date().getTime();
					const url = new URL('https://your-website.com');
					url.searchParams.append('t', timestamp);
					
					// Create a new window/tab with cache-control headers
					const newWindow = window.open('about:blank', '_blank');
					if (newWindow) {
						newWindow.location.href = url.toString();
						// Force reload without cache
						newWindow.location.reload(true);
					} else {
						// Fallback if popup is blocked
						window.location.href = url.toString();
					}
				}
			}
		};
		
		// Add both touch and click event listeners
		document.addEventListener('click', handleInteraction);
		document.addEventListener('touchstart', handleInteraction);
		document.addEventListener('touchend', handleInteraction);
		
		const topPlaneMaterial = new THREE.MeshBasicMaterial({map: topTexture, transparent: true});
		const topPlane = new THREE.Mesh(topPlaneGeometry, topPlaneMaterial);
		
		// Position the top plane
		topPlane.position.set(0, 1, 0);
		
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
		airplaneAnchor.group.add(topPlane);
		airplaneAnchor.group.add(phoneIcon);
		airplaneAnchor.group.add(emailIcon);
		airplaneAnchor.group.add(webIcon);
		airplaneAnchor.group.add(arrow);
		
		// Initialize positions
		phoneIcon.position.set(-0.4, -0.8, 0);
		emailIcon.position.set(0, -0.8, 0);
		webIcon.position.set(0.4, -0.8, 0);
		arrow.position.set(0, -0.4, 0);

		// Set initial scales to normal
		phoneIcon.scale.set(1, 1, 1);
		emailIcon.scale.set(1, 1, 1);
		webIcon.scale.set(1, 1, 1);
		arrow.scale.set(1, 1, 1);

		let isFirstDetection = true;

		// Setup audio
		camera.add(airListener);
		airplaneAudio.setRefDistance(100);
		airplaneAudio.setBuffer(airplaneAclip);
		airplaneAudio.setLoop(true);
		airplaneAnchor.group.add(airplaneAudio);

		// make airplane audio play and reset animations when the target is detected
		airplaneAnchor.onTargetFound = () => {
			airplaneAudio.play();
			if (isFirstDetection) {
				resetAnimations();
				isFirstDetection = false;
			}
		}

		// make airplane audio pause when the target is lost
		airplaneAnchor.onTargetLost = () => {
			airplaneAudio.pause();
			isFirstDetection = true;  // Reset for next detection
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
		
		// Single animation loop
		renderer.setAnimationLoop(() => {
			const delta = clock.getDelta();
			
			// Update all mixers
			airplaneMixer.update(delta);
			ballMixer.update(delta);
			carMixer.update(delta);
			dogMixer.update(delta);
			
			// Update car rotation
			car.scene.rotation.set(0, car.scene.rotation.y + delta, 0);
			
			// Run animations if they're active
			if (!isFirstDetection) {
				animateIntro();
				animateArrowHover();
			}
			
			renderer.render(scene, camera);
		});
	}
	start();
	
});
