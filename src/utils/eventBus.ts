// src/utils/eventBus.ts
import mitt from "mitt";

type Events = {
    showLogin: void;
    updateCartCount: void;
    searchProduct: void;
};

const eventBus = mitt<Events>();

export default eventBus;
