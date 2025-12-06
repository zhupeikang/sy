<template>
    <div class="container" ref="containerRef">
        <Loading v-if="loadingRef" />
        <van-icon name="cross" class="closeBtn" size="8vw" @click="$emit('close')" />
        <canvas class="canvas" ref="canvasRef"></canvas>
    </div>
</template>

<script lang="js">

import { colorBackground } from '@/utils/const';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { onMounted, onUnmounted, ref } from 'vue';

export default {
    name: 'MyComponent',
    props: {
        modelFileName: {
            type: String,
            required: true,
        },
        scale: {
            type: Number,
            default: 5
        }
    },
    emits: ['close'],
    setup(props) {
        const canvasRef = ref(null);
        const containerRef = ref(null);
        const loadingRef = ref(true); // 初始化为 true

        const state = {
            width: 0,
            height: 0,
            camera: null,
            scene: null,
            renderer: null,
            controls: null,
            animationId: null,
            loading: true,
        };

        const init = () => {
            // 初始化画布大小
            state.width = containerRef.value.offsetWidth;
            state.height = window.innerHeight;

            // 创建相机
            const camera = new THREE.PerspectiveCamera(
                45,
                state.width / state.height,
                1,
                1000
            );
            camera.position.set(0, 0, 10);
            state.camera = camera;

            // 创建场景
            const scene = new THREE.Scene();
            scene.background = new THREE.Color(colorBackground);
            state.scene = scene;

            // 创建渲染器
            const renderer = new THREE.WebGLRenderer({
                canvas: canvasRef.value,
                antialias: true,
            });
            renderer.setSize(state.width, state.height);
            state.renderer = renderer;

            // 创建控制器
            const controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.1;
            controls.rotateSpeed = 0.5;
            controls.zoomSpeed = 1.2;
            controls.panSpeed = 0.8;
            controls.target.set(0, 0, 0);
            state.controls = controls;

            // 加载模型
            const loader = new GLTFLoader();
            const modelFileName = props.modelFileName;
            loader.load(
                modelFileName,
                (gltf) => {
                    console.log('加载成功');
                    loadingRef.value = false; // 加载完成后更新loading状态
                    const model = gltf.scene;
                    model.scale.set(props.scale, props.scale, props.scale);
                    scene.add(model);

                    animate();
                },
                undefined,
                (error) => {
                    console.error(error);
                }
            );

            // 开始动画循环
            const animate = () => {
                state.animationId = requestAnimationFrame(animate);

                // 模型自动旋转
                scene.rotation.y += 0.01;

                // 更新控制器
                // state.controls.update();

                // 渲染场景
                renderer.render(scene, camera);
            };
        };

        const handleResize = () => {
            // 更新画布大小
            state.width = containerRef.value.offsetWidth;
            state.height = window.innerHeight;

            // 更新相机视口和渲染器大小
            state.camera.aspect = state.width / state.height;
            state.camera.updateProjectionMatrix();
            state.renderer.setSize(state.width, state.height);
        };
        onMounted(() => {
            init();
            window.addEventListener('resize', handleResize);
        });

        onUnmounted(() => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(state.animationId);
        });

        return {
            loadingRef,
            canvasRef,
            containerRef,
        };
    },
};
</script>

<style>
.closeBtn {
    position: fixed;
    top: 20px;
    right: 20px;
    cursor: pointer;
    z-index: 99;
}

.container {
    width: 100%;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 200;
    background-color: var(--color-background);
    line-height: 100vh;
    text-align: center;
}

.canvas {
    width: 100%;
    height: 100%;
    display: block;
}
</style>
