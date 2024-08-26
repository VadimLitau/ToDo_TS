import create, { State, StateCreator } from "zustand";
import { generateId } from "./helpers";
import { devtools } from "zustand/middleware";

interface ITask {
	id: string;
	title: string;
	createdAt: number;
	status: string;
}

interface IToDoStore {
	tasks: ITask[];
	createTask: (title: string) => void;
	updateTask: (id: string, title: string) => void;
	complеtedTask: (id: string) => void;
	removeTask: (id: string) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isToDoStore(object: any): object is IToDoStore {
	return "tasks" in object;
}

const localStorageUpdate =
	<T extends State>(config: StateCreator<T>): StateCreator<T> =>
	(set, get, api) =>
		config(
			(nextState, ...args) => {
				if (isToDoStore(nextState)) {
					window.localStorage.setItem("tasks", JSON.stringify(nextState.tasks));
				}
				set(nextState, ...args);
			},
			get,
			api
		);

const getCurrentState = () => {
	try {
		const currentState = JSON.parse(
			window.localStorage.getItem("tasks") || "[]"
		) as ITask[];
		return currentState;
	} catch (err) {
		window.localStorage.setItem("tasks", "[]");
	}
	return [];
};

export const useToDoStore = create<IToDoStore>(
	localStorageUpdate(
		devtools((set, get) => ({
			tasks: getCurrentState(),
			createTask: (title) => {
				const { tasks } = get();
				const newTask = {
					id: generateId(),
					title,
					createdAt: Date.now(),
					status: "inProgress",
				};

				set({
					tasks: [newTask, ...tasks],
				});
			},
			updateTask: (id, title) => {
				const { tasks } = get();
				set({
					tasks: tasks.map((task) => ({
						...task,
						title: task.id === id ? title : task.title,
					})),
				});
			},
			complеtedTask: (id: string) => {
				const { tasks } = get();
				set({
					tasks: tasks.map((task) => ({
						...task,
						status:
							task.id === id && task.status != "completed"
								? "completed"
								: task.id === id && task.status === "completed"
								? "inProgress"
								: task.status,
					})),
				});
			},
			removeTask: (id: string) => {
				const { tasks } = get();
				set({
					tasks: tasks.filter((task) => {
						return task.id !== id;
					}),
				});
			},
		}))
	)
);
