import React, { Component } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import './styles/ObjectInThreeD.css'

class ObjectInThreeD extends Component {

    constructor(props) {
        super(props)
        this.showModal = this.showModal.bind(this);
        this.removeModal = this.removeModal.bind(this);
        this.handleResize = this.handleResize.bind(this);
        var size = Math.min(window.innerHeight, window.innerWidth)
        this.state = {
            modalLoaded: false,
            scene: new THREE.Scene(),
            camera: new THREE.PerspectiveCamera(75, size / size, 0.1, 1000),
            renderer: new THREE.WebGLRenderer({ antialias: true })
        };
    }


    showModal() {
        //popup modal on screen
        const modal_container = document.getElementById('modal-container')
        modal_container.classList.add('show')

        // if 3js image is loaded, then avoid reloading it again
        if (this.state.modalLoaded) return;

        // initiate the scene, camera and renderer
        var scene = this.state.scene;
        var camera = this.state.camera;
        var renderer = this.state.renderer

        // put the renderer on the page
        document.getElementById('three-d-container').appendChild(renderer.domElement)

        //orbit controls to change point of view
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableZoom = true;

        //create three light angles
        var keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 1.0);
        keyLight.position.set(-100, 0, 100);
        var fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75);
        fillLight.position.set(100, 0, 100);
        var backLight = new THREE.DirectionalLight(0xffffff, 1.0);
        backLight.position.set(100, 0, -100);

        //add light to the scene
        scene.add(keyLight);
        scene.add(fillLight);
        scene.add(backLight);

        // set the position of the camera
        camera.position.z = 155;

        // animation function
        var animate = function () {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };
        animate();

        // load the obj file into the app
        const objLoader = new OBJLoader()
        objLoader.load(
            './../person.obj',
            (object) => {
                object.position.y = -90
                scene.add(object)

                // makes sure the component knows that 3js is loaded to avoid extra calls to api
                this.setState({ modalLoaded: true })
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
            },
            (error) => {
                console.log(error)
            }
        )
    }

    removeModal() {
        const modal_container = document.getElementById('modal-container')
        modal_container.classList.remove('show')
    }

    componentDidMount() {
        this.handleResize();
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    handleResize() {
        const modal = document.getElementById('modal')
        var length = Math.min(modal.clientHeight, modal.clientWidth)
        this.state.renderer.setSize(length, length);
    }

    render() {
        return (
            <>
                <button id="open" onClick={this.showModal}>
                    Click me please
                </button>

                <div className="modal-container" id="modal-container">
                    <div className="close-container">
                        <button id="close-button" onClick={this.removeModal}>
                            X
                        </button>
                    </div>

                    <div className="modal" id="modal">
                        <div id="three-d-container"></div>

                    </div>
                </div>
            </>
        )
    }
}

export default ObjectInThreeD
