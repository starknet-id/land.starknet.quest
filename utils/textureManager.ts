import THREE from "three";

const textureManager = {
  textures: {} as any,

  loadTexture: function (key: string, url: string) {
    const loader = new THREE.TextureLoader();
    loader.load(
      url,
      (texture) => {
        this.textures[key] = texture;
      },
      undefined,
      (error) => {
        console.error("An error occurred while loading the texture.");
      }
    );
  },

  getTexture: function (key: string) {
    return this.textures[key];
  },

  getTexturesStartingWith: function (prefix: string) {
    return Object.keys(this.textures).filter((key) => key.startsWith(prefix));
  },
};

export default textureManager;
