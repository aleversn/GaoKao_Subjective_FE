import tool from "../tools";

const AsyncLoad = tool.AsyncLoad;

export default {
    path: "/chat",
    name: "Chat",
    component: () => AsyncLoad(import("@/views/chat/")),
    children: [
        {
            path: "",
            name: "Chat",
            component: () => AsyncLoad(import("@/views/chat/chat.vue"))
        },
        {
            path: ":chatid",
            name: "Chat",
            component: () => AsyncLoad(import("@/views/chat/chat.vue"))
        }
    ]
}