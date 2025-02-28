import tool from "../tools";

const AsyncLoad = tool.AsyncLoad;

export default {
    path: "/board",
    name: "board",
    component: () => AsyncLoad(import("@/views/board/")),
    children: [
        {
            path: "",
            name: "board",
            component: () => AsyncLoad(import("@/views/board/preview.vue"))
        }
    ]
}