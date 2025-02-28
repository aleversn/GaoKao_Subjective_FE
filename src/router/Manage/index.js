import tool from "../tools";

const AsyncLoad = tool.AsyncLoad;

export default {
    path: "/m",
    component: () => AsyncLoad(import("@/views/manage")),
    children: [
        {
            path: '',
            component: () => AsyncLoad(import("@/views/manage/users"))
        },
        {
            path: 'feedback',
            component: () => AsyncLoad(import("@/views/manage/feedback"))
        },
        {
            path: 'playground',
            component: () => AsyncLoad(import("@/views/manage/playground"))
        },
        {
            path: 'models',
            component: () => AsyncLoad(import("@/views/manage/models"))
        },
        {
            path: 'quick',
            component: () => AsyncLoad(import("@/views/manage/quickInstructions"))
        },
        {
            path: 'quick/:id',
            component: () => AsyncLoad(import("@/views/manage/quickInstructions"))
        }
    ]
};
