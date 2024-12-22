// src/utils/eventBus.ts
import mitt from "mitt";

type Events = {
    showLogin: void;
};

const eventBus = mitt<Events>();

export default eventBus;
