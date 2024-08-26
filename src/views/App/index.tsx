import styles from "./index.module.scss";
import { useToDoStore } from "../../data/stores/useToDoStore";
import { InputPlus } from "../components/InputPlus";
import { InputTask } from "../components/InputTasK";
import { useEffect, useState } from "react";
import { StatusSection } from "../components/statusSection";

interface ITask {
	id: string;
	title: string;
	createdAt: number;
	status: string;
}

export const App: React.FC = () => {
	const [tasks, createTask, updateTask, completedTask, removeTask] =
		useToDoStore((state) => [
			state.tasks,
			state.createTask,
			state.updateTask,
			state.complеtedTask,
			state.removeTask,
		]);

	const [inProgressTasks, setInProgressTasks] = useState<ITask[]>([]);
	const [completedTasks, setCompletedTasks] = useState<ITask[]>([]);

	useEffect(() => {
		setInProgressTasks(tasks.filter((task) => task.status === "inProgress"));
		setCompletedTasks(tasks.filter((task) => task.status === "completed"));
	}, [tasks]);

	return (
		<article className={styles.article}>
			<h1 className={styles.articleTitle}>To Do App</h1>
			<section className={styles.articleSection}>
				<InputPlus
					onAdd={(title) => {
						if (title) {
							createTask(title);
						}
					}}
				></InputPlus>
			</section>
			<section className={styles.articleSection}>
				{!tasks.length && (
					<p className={`${styles.articleText} ${styles.articleTaskStatus}`}>
						There is no one task.
					</p>
				)}
				{tasks.length != 0 ? (
					<StatusSection
						size={inProgressTasks.length}
						statusName={"In Progress"}
						statusText={"No Task"}
					/>
				) : (
					""
				)}
				{inProgressTasks.map((task) => (
					<InputTask
						id={task.id}
						title={task.title}
						onDone={completedTask}
						onEdited={updateTask}
						onRemoved={removeTask}
						key={task.id}
						status={task.status}
					/>
				))}
				{tasks.length != 0 ? (
					<StatusSection
						size={completedTasks.length}
						statusName={"Completed"}
						statusText={"No Task"}
					/>
				) : (
					""
				)}
				{completedTasks.map((task) => (
					<InputTask
						id={task.id}
						title={task.title}
						onDone={completedTask}
						onEdited={updateTask}
						onRemoved={removeTask}
						key={task.id}
						status={task.status}
					/>
				))}
			</section>
		</article>
	);
};
