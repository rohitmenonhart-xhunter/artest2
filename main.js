import { GLTFLoader} from "./libs/GLTFLoader.js";
const THREE = window.MINDAR.IMAGE.THREE;
import {loadGLTF, loadAudio} from "./libs/loader.js";

document.addEventListener('DOMContentLoaded', () => {
	// Add permanent text overlay
	const overlay = document.createElement('div');
	overlay.style.position = 'fixed';
	overlay.style.bottom = '20px';
	overlay.style.right = '20px';
	overlay.style.backgroundColor = 'rgba(160, 37, 104, 0.9)'; // Using the magenta theme color
	overlay.style.color = 'white';
	overlay.style.padding = '10px 20px';
	overlay.style.borderRadius = '10px';
	overlay.style.fontFamily = 'Montserrat, sans-serif';
	overlay.style.fontSize = '14px';
	overlay.style.zIndex = '1000';
	overlay.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
	overlay.style.backdropFilter = 'blur(5px)';
	overlay.style.border = '1px solid rgba(255,255,255,0.1)';
	overlay.style.lineHeight = '1.5';
	overlay.style.maxWidth = '300px';
	overlay.style.textAlign = 'right';
	overlay.innerHTML = `
		If you need this type of smart visiting card<br>
		contact: <a href="mailto:contactrohitmenon@gmail.com" style="color: #FF9CC7; text-decoration: none;">contactrohitmenon@gmail.com</a>
	`;
	document.body.appendChild(overlay);

	const start = async() => {
		const mindarThree = new window.MINDAR.IMAGE.MindARThree({
			container: document.body,
			imageTargetSrc: './targets.mind',
			maxTrack: 1,  // Changed to 1 since we only need one marker
		});
		
		const {renderer, scene, camera} = mindarThree;
		
		const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
		scene.add(light);
		
		// Create texture loader for loading images
		const textureLoader = new THREE.TextureLoader();
		
		// Create top title plane with modern design
		const topGeometry = new THREE.PlaneGeometry(1.6, 0.6);
		const topCanvas = document.createElement('canvas');
		topCanvas.width = 768;
		topCanvas.height = 256;
		const topContext = topCanvas.getContext('2d');
		
		// Create transparent background with enhanced blur effect
		topContext.fillStyle = 'rgba(255, 255, 255, 0.02)';
		topContext.fillRect(0, 0, topCanvas.width, topCanvas.height);
		
		// Add enhanced glass effect with stronger blur
		const glassGradient = topContext.createLinearGradient(0, 0, 0, topCanvas.height);
		glassGradient.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
		glassGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.15)');
		glassGradient.addColorStop(1, 'rgba(255, 255, 255, 0.08)');
		topContext.fillStyle = glassGradient;
		topContext.fillRect(0, 0, topCanvas.width, topCanvas.height);
		
		// Add more pronounced noise texture for enhanced blur effect
		for(let i = 0; i < 200; i++) {
			topContext.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.03})`;
			topContext.fillRect(
				Math.random() * topCanvas.width,
				Math.random() * topCanvas.height,
				2,
				2
			);
		}
		
		// Add additional blur layer
		const blurGradient = topContext.createRadialGradient(
			topCanvas.width/2, topCanvas.height/2, 0,
			topCanvas.width/2, topCanvas.height/2, topCanvas.width/2
		);
		blurGradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
		blurGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
		topContext.fillStyle = blurGradient;
		topContext.fillRect(0, 0, topCanvas.width, topCanvas.height);
		
		// Add rounded corners with larger radius
		topContext.globalCompositeOperation = 'destination-in';
		topContext.beginPath();
		topContext.roundRect(0, 0, topCanvas.width, topCanvas.height, 40);
		topContext.fill();
		topContext.globalCompositeOperation = 'source-over';
		
		// Add main title with enhanced shadow
		topContext.shadowColor = 'rgba(0, 0, 0, 0.4)';
		topContext.shadowBlur = 25;
		topContext.shadowOffsetY = 8;
		topContext.fillStyle = 'white';
		topContext.textAlign = 'center';
		
		// Draw "MOCKELLO" text with ultra-modern font stack
		topContext.font = 'bold 110px "Neue Haas Grotesk Display Pro", "Roobert", "Space Grotesk", sans-serif';
		topContext.letterSpacing = '8px';
		// Add slight gradient to text
		const textGradient = topContext.createLinearGradient(0, 80, 0, 160);
		textGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
		textGradient.addColorStop(1, 'rgba(255, 255, 255, 0.95)');
		topContext.fillStyle = textGradient;
		topContext.fillText('MOCKELLO', topCanvas.width/2, 120);
		
		// Add modern subtitle
		topContext.shadowBlur = 15;
		topContext.shadowOffsetY = 4;
		topContext.font = '500 24px "Cabinet Grotesk", "Roobert", sans-serif';
		topContext.letterSpacing = '8px';
		topContext.fillStyle = 'rgba(255, 255, 255, 0.9)';
		topContext.fillText('YOUR PERSONAL INTERVIEW TRAINER', topCanvas.width/2, 175);
		
		// Add subtle accent lines with gradient
		topContext.shadowColor = 'transparent';
		const lineGradient = topContext.createLinearGradient(
			topCanvas.width/2 - 220, 0,
			topCanvas.width/2 + 220, 0
		);
		lineGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
		lineGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
		lineGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
		
		// Top accent
		topContext.strokeStyle = lineGradient;
		topContext.beginPath();
		topContext.moveTo(topCanvas.width/2 - 220, 65);
		topContext.lineTo(topCanvas.width/2 + 220, 65);
		topContext.lineWidth = 1;
		topContext.stroke();
		
		// Bottom accent
		topContext.beginPath();
		topContext.moveTo(topCanvas.width/2 - 180, 195);
		topContext.lineTo(topCanvas.width/2 + 180, 195);
		topContext.lineWidth = 0.5;
		topContext.stroke();
		
		const topTexture = new THREE.CanvasTexture(topCanvas);
		const topMaterial = new THREE.MeshBasicMaterial({
			map: topTexture,
			transparent: true,
			opacity: 0.75  // Increased transparency for better blur effect
		});
		const topPlane = new THREE.Mesh(topGeometry, topMaterial);
		topPlane.position.set(0, 1.5, 0);  // Moved higher (from 1.2 to 1.5)
		
		// Create video texture with larger size
		const video = document.createElement('video');
		video.src = './video/mockello.mp4';
		video.loop = true;
		video.muted = true;
		video.playsInline = true;
		video.setAttribute('playsinline', '');
		const videoTexture = new THREE.VideoTexture(video);
		
		// Create About Us plane with modern design
		const aboutUsGeometry = new THREE.PlaneGeometry(1.4, 1.2);
		const aboutUsCanvas = document.createElement('canvas');
		aboutUsCanvas.width = 700;
		aboutUsCanvas.height = 768;
		const aboutUsContext = aboutUsCanvas.getContext('2d');
		
		// Create transparent background with blur effect for About Us
		aboutUsContext.fillStyle = 'rgba(255, 255, 255, 0.1)';
		aboutUsContext.fillRect(0, 0, aboutUsCanvas.width, aboutUsCanvas.height);
		
		// Add glass effect
		const aboutGlassGradient = aboutUsContext.createLinearGradient(0, 0, 0, aboutUsCanvas.height);
		aboutGlassGradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
		aboutGlassGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.15)');
		aboutGlassGradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
		aboutUsContext.fillStyle = aboutGlassGradient;
		aboutUsContext.fillRect(0, 0, aboutUsCanvas.width, aboutUsCanvas.height);
		
		// Add rounded corners
		aboutUsContext.globalCompositeOperation = 'destination-in';
		aboutUsContext.beginPath();
		aboutUsContext.roundRect(0, 0, aboutUsCanvas.width, aboutUsCanvas.height, 30);
		aboutUsContext.fill();
		aboutUsContext.globalCompositeOperation = 'source-over';
		
		// Add subtle pattern
		aboutUsContext.fillStyle = 'rgba(255, 255, 255, 0.05)';
		for(let i = 0; i < 10; i++) {
			aboutUsContext.fillRect(0, i * 80, aboutUsCanvas.width, 1);
		}
		
		// Modern title with enhanced shadow
		aboutUsContext.shadowColor = 'rgba(0, 0, 0, 0.4)';
		aboutUsContext.shadowBlur = 20;
		aboutUsContext.shadowOffsetY = 6;
		aboutUsContext.fillStyle = 'white';
		aboutUsContext.textAlign = 'left';
		
		// Title text with modern font
		aboutUsContext.font = 'bold 80px "Clash Display", "Space Grotesk", sans-serif';
		aboutUsContext.letterSpacing = '4px';
		aboutUsContext.fillText('ABOUT', 60, 110);
		aboutUsContext.font = '300 46px "Cabinet Grotesk", "Space Grotesk", sans-serif';
		aboutUsContext.fillText('US', 60, 160);
		
		// Add modern description with adjusted font sizes and positions
		const descriptions = [
			{ text: 'AI-powered mock', size: 48, weight: '600', y: 280 },
			{ text: 'interviews with', size: 48, weight: '600', y: 330 },
			{ text: 'college-specific', size: 44, weight: '500', y: 380 },
			{ text: 'aptitude tests.', size: 44, weight: '500', y: 430 },
			{ text: 'Master your skills with', size: 40, weight: '400', y: 490 },
			{ text: 'detailed feedback', size: 42, weight: '600', y: 540 }
		];
		
		descriptions.forEach(desc => {
			aboutUsContext.font = `${desc.weight} ${desc.size}px "Space Grotesk", sans-serif`;
			aboutUsContext.letterSpacing = '2px';
			aboutUsContext.fillText(desc.text, 60, desc.y);
		});
		
		// Add accent elements
		aboutUsContext.strokeStyle = 'rgba(255, 255, 255, 0.3)';
		aboutUsContext.beginPath();
		aboutUsContext.moveTo(60, 190);
		aboutUsContext.lineTo(300, 190);
		aboutUsContext.lineWidth = 1;
		aboutUsContext.stroke();
		
		const aboutUsTexture = new THREE.CanvasTexture(aboutUsCanvas);
		const aboutUsMaterial = new THREE.MeshBasicMaterial({
			map: aboutUsTexture,
			transparent: true,
			opacity: 0.9
		});
		const aboutUsPlane = new THREE.Mesh(aboutUsGeometry, aboutUsMaterial);
		
		// Create video plane with glass effect background
		const videoWidth = 1.6;
		const videoHeight = videoWidth * (9/16);
		const videoGeometry = new THREE.PlaneGeometry(videoWidth, videoHeight);
		
		// Create a canvas for video background
		const videoBackCanvas = document.createElement('canvas');
		videoBackCanvas.width = 512;
		videoBackCanvas.height = 512;
		const videoBackContext = videoBackCanvas.getContext('2d');
		
		// Add glass effect to video background
		const videoGlassGradient = videoBackContext.createLinearGradient(0, 0, 0, videoBackCanvas.height);
		videoGlassGradient.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
		videoGlassGradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
		videoBackContext.fillStyle = videoGlassGradient;
		videoBackContext.fillRect(0, 0, videoBackCanvas.width, videoBackCanvas.height);
		
		// Add rounded corners to video
		videoBackContext.globalCompositeOperation = 'destination-in';
		videoBackContext.beginPath();
		videoBackContext.roundRect(0, 0, videoBackCanvas.width, videoBackCanvas.height, 30);
		videoBackContext.fill();
		
		const videoBackTexture = new THREE.CanvasTexture(videoBackCanvas);
		
		// Create video materials
		const videoBackMaterial = new THREE.MeshBasicMaterial({
			map: videoBackTexture,
			transparent: true,
			opacity: 0.9
		});
		
		const videoMaterial = new THREE.MeshBasicMaterial({
			map: videoTexture,
			transparent: true,
			opacity: 0
		});
		
		// Create video planes
		const videoBackPlane = new THREE.Mesh(videoGeometry, videoBackMaterial);
		const videoPlane = new THREE.Mesh(videoGeometry, videoMaterial);
		
		// Position video planes
		videoBackPlane.position.set(3, videoHeight/4, -0.01); // Slightly behind video
		videoPlane.position.set(3, videoHeight/4, 0);
		
		// Create bottom section with glass effect
		const bottomGeometry = new THREE.PlaneGeometry(1.8, 0.4);
		const bottomCanvas = document.createElement('canvas');
		bottomCanvas.width = 512;
		bottomCanvas.height = 128;
		const bottomContext = bottomCanvas.getContext('2d');
		
		// Add glass effect to bottom section
		const bottomGlassGradient = bottomContext.createLinearGradient(0, 0, 0, bottomCanvas.height);
		bottomGlassGradient.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
		bottomGlassGradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
		bottomContext.fillStyle = bottomGlassGradient;
		bottomContext.fillRect(0, 0, bottomCanvas.width, bottomCanvas.height);
		
		// Add rounded corners to bottom section
		bottomContext.globalCompositeOperation = 'destination-in';
		bottomContext.beginPath();
		bottomContext.roundRect(0, 0, bottomCanvas.width, bottomCanvas.height, 20);
		bottomContext.fill();
		
		const bottomTexture = new THREE.CanvasTexture(bottomCanvas);
		const bottomMaterial = new THREE.MeshBasicMaterial({
			map: bottomTexture,
			transparent: true,
			opacity: 0.9
		});
		const bottomPlane = new THREE.Mesh(bottomGeometry, bottomMaterial);
		bottomPlane.position.set(0, -0.9, -0.1); // Position behind icons
		
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
		
		// Create icon planes
		const iconGeometry = new THREE.PlaneGeometry(0.3, 0.3);
		const phoneIcon = new THREE.Mesh(iconGeometry, phoneMaterial);
		const emailIcon = new THREE.Mesh(iconGeometry, emailMaterial);
		const webIcon = new THREE.Mesh(iconGeometry, webMaterial);
		
		// Create arrow
		const arrowGeometry = new THREE.PlaneGeometry(0.4, 0.4);
		const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
		
		// Initialize positions
		phoneIcon.position.set(-0.4, -0.8, 0);
		emailIcon.position.set(0, -0.8, 0);
		webIcon.position.set(0.4, -0.8, 0);
		arrow.position.set(0, -0.4, 0);
		
		// Make elements interactive
		const raycaster = new THREE.Raycaster();
		const mouse = new THREE.Vector2();
		
		// Function to create vCard
		const createVCard = () => {
			const vcard = `BEGIN:VCARD
VERSION:3.0
FN:Mockello
ORG:AI-powered mock interviews with personalized feedback
TEL;TYPE=work,voice:+917550000805
EMAIL;TYPE=work:contactrohitmenon@gmail.com
URL:https://mockello.com
END:VCARD`;
			return new Blob([vcard], { type: 'text/vcard' });
		};
		
		// Handle interactions
		const handleInteraction = (event) => {
			event.preventDefault();
			
			const x = event.clientX || (event.touches && event.touches[0].clientX);
			const y = event.clientY || (event.touches && event.touches[0].clientY);
			
			if (x === undefined || y === undefined) return;
			
			mouse.x = (x / window.innerWidth) * 2 - 1;
			mouse.y = -(y / window.innerHeight) * 2 + 1;
			
			raycaster.setFromCamera(mouse, camera);
			
			// Check video interaction
			const videoIntersects = raycaster.intersectObject(videoPlane);
			if (videoIntersects.length > 0) {
				if (video.paused) {
					video.muted = false;
					video.play();
				} else {
					video.pause();
					video.muted = true;
				}
				return;
			}
			
			// Check icon interactions
			const iconIntersects = raycaster.intersectObjects([phoneIcon, emailIcon, webIcon]);
			if (iconIntersects.length > 0) {
				const clickedIcon = iconIntersects[0].object;
				if (clickedIcon === phoneIcon) {
					const vCardBlob = createVCard();
					const vCardURL = URL.createObjectURL(vCardBlob);
					
					const downloadLink = document.createElement('a');
					downloadLink.href = vCardURL;
					downloadLink.download = 'contact.vcf';
					document.body.appendChild(downloadLink);
					downloadLink.click();
					document.body.removeChild(downloadLink);
					URL.revokeObjectURL(vCardURL);
					
					setTimeout(() => {
						window.location.href = 'tel:+917550000805';
					}, 100);
				} else if (clickedIcon === emailIcon) {
					window.location.href = 'mailto:contactrohitmenon@gmail.com';
				} else if (clickedIcon === webIcon) {
					window.open('https://mockello.com', '_blank');
				}
			}
		};
		
		// Add event listeners
		document.addEventListener('click', handleInteraction);
		document.addEventListener('touchstart', handleInteraction);
		
		const anchor = mindarThree.addAnchor(0);
		anchor.group.add(topPlane);      // Add top plane
		anchor.group.add(aboutUsPlane);
		anchor.group.add(videoBackPlane);
		anchor.group.add(videoPlane);
		anchor.group.add(phoneIcon);
		anchor.group.add(emailIcon);
		anchor.group.add(webIcon);       // Add web icon back
		anchor.group.add(arrow);         // Add arrow back
		anchor.group.add(bottomPlane);
		
		// Animation variables
		let startTime = Date.now();
		const animationDuration = 1500; // Increased duration for smoother animations
		let isFirstDetection = true;
		
		// Animation function with enhanced effects
		const animate = () => {
			const currentTime = Date.now();
			const elapsed = currentTime - startTime;
			const progress = Math.min(1, elapsed / animationDuration);
			
			// Custom easing functions
			const easeOutBack = (t) => {
				const c1 = 1.70158;
				const c3 = c1 + 1;
				return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
			};
			
			const easeOutElastic = (t) => {
				const c4 = (2 * Math.PI) / 3;
				return t === 0 ? 0 : t === 1 ? 1 :
					Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
			};
			
			// Animate top title with bounce effect
			if (progress < 0.3) {
				const titleProgress = Math.min(1, progress / 0.3);
				topPlane.position.y = 1.2 + (1 - easeOutBack(titleProgress)) * 2;
				topPlane.scale.set(
					1 + (1 - easeOutElastic(titleProgress)) * 0.3,
					1 + (1 - easeOutElastic(titleProgress)) * 0.3,
					1
				);
			} else {
				// Subtle floating animation for title
				topPlane.position.y = 1.2 + Math.sin(currentTime * 0.002) * 0.03;
			}
			
			// Animate About Us section with slide and fade
			if (progress > 0.2) {
				const aboutProgress = Math.min(1, (progress - 0.2) / 0.8);
				aboutUsPlane.position.x = -1.5 + (0.3 * easeOutBack(aboutProgress));
				aboutUsPlane.position.y = Math.sin(currentTime * 0.002) * 0.02; // Subtle hover
				aboutUsPlane.material.opacity = aboutProgress;
				aboutUsPlane.rotation.z = Math.sin(currentTime * 0.001) * 0.01; // Subtle rotation
			}
			
			// Animate video with slide and scale
			if (progress > 0.4) {
				const videoProgress = Math.min(1, (progress - 0.4) / 0.6);
				videoPlane.position.x = 3 - (1.8 * easeOutBack(videoProgress));
				videoPlane.scale.set(
					1 + Math.sin(currentTime * 0.002) * 0.02,
					1 + Math.sin(currentTime * 0.002) * 0.02,
					1
				);
				videoMaterial.opacity = videoProgress;
			}
			
			// Animate bottom icons with stagger
			if (progress > 0.6) {
				const iconProgress = Math.min(1, (progress - 0.6) / 0.4);
				const iconScale = 1 + Math.sin(currentTime * 0.004) * 0.1;
				
				// Phone icon
				phoneIcon.scale.set(iconScale, iconScale, 1);
				phoneIcon.rotation.z = Math.sin(currentTime * 0.002) * 0.1;
				
				// Email icon with delay
				const emailDelay = Math.min(1, (progress - 0.7) / 0.3);
				emailIcon.scale.set(iconScale * emailDelay, iconScale * emailDelay, 1);
				emailIcon.rotation.z = Math.sin((currentTime + 500) * 0.002) * 0.1;
				
				// Web icon with delay
				const webDelay = Math.min(1, (progress - 0.8) / 0.2);
				webIcon.scale.set(iconScale * webDelay, iconScale * webDelay, 1);
				webIcon.rotation.z = Math.sin((currentTime + 1000) * 0.002) * 0.1;
			}
			
			// Animate arrow with pulse effect
			if (progress > 0.9) {
				const arrowScale = 1 + Math.sin(currentTime * 0.006) * 0.15;
				arrow.scale.set(arrowScale, arrowScale, 1);
				arrow.position.y = -0.4 + Math.sin(currentTime * 0.003) * 0.1;
				arrow.rotation.z = Math.sin(currentTime * 0.002) * 0.15;
			}
		};
		
		// Target detection handlers with enhanced reset
		anchor.onTargetFound = () => {
			startTime = Date.now();
			video.play();
			
			// Reset all transformations
			topPlane.scale.set(1, 1, 1);
			aboutUsPlane.material.opacity = 0;
			videoMaterial.opacity = 0;
			phoneIcon.scale.set(0, 0, 1);
			emailIcon.scale.set(0, 0, 1);
			webIcon.scale.set(0, 0, 1);
			arrow.scale.set(0, 0, 1);
		};
		
		anchor.onTargetLost = () => {
			aboutUsPlane.position.set(-1.5, 0, 0);
			videoPlane.position.set(3, videoHeight/3, 0);
			videoMaterial.opacity = 0;
			video.pause();
			video.muted = true;
			
			// Reset all animations
			topPlane.position.y = 1.2;
			topPlane.scale.set(1, 1, 1);
			aboutUsPlane.rotation.z = 0;
			phoneIcon.scale.set(1, 1, 1);
			emailIcon.scale.set(1, 1, 1);
			webIcon.scale.set(1, 1, 1);
			arrow.scale.set(1, 1, 1);
		};
		
		await mindarThree.start();		
		
		// Animation loop
		renderer.setAnimationLoop(() => {
			animate();
			renderer.render(scene, camera);
		});
	}
	start();
});
