import { useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";

interface IInputTask {
	id: string;
	title: string;
	status: string;
	onDone: (id: string) => void;
	onEdited: (id: string, title: string) => void;
	onRemoved: (id: string) => void;
}

export const InputTask: React.FC<IInputTask> = ({
	id,
	title,
	status,
	onDone,
	onEdited,
	onRemoved,
}) => {
	const [checked, setChecked] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);
	const [value, setValue] = useState(title);
	const editTitleInputRef = useRef<HTMLInputElement>(null);

	const addEditTask = () => {
		onEdited(id, value);
		setIsEditMode(false);
	};

	useEffect(() => {
		if (isEditMode) {
			editTitleInputRef?.current?.focus();
		}
	}, [isEditMode]);
	return (
		<div className={styles.inputTask}>
			<label className={styles.inputTaskLabel}>
				<input
					type="checkbox"
					checked={status === "completed" ? true : checked}
					disabled={isEditMode}
					className={styles.inputTaskCheckbox}
					onChange={(evt) => {
						setChecked(evt.target.checked);

						onDone(id);
					}}
				/>
				{isEditMode ? (
					<input
						value={value}
						ref={editTitleInputRef}
						onChange={(evt) => {
							setValue(evt.target.value);
						}}
						onKeyDown={(evt) => {
							if (evt.key === "Enter") {
								addEditTask();
							}
						}}
						className={styles.inputTaskTitleEdit}
					/>
				) : (
					<h3
						className={
							status === "completed"
								? `${styles.inputTaskTitle} ${styles.inputTaskTitleCompleted}`
								: `${styles.inputTaskTitle}`
						}
					>
						{title}
					</h3>
				)}
			</label>
			{isEditMode ? (
				<button
					aria-label="save"
					className={styles.inputTaskSave}
					onClick={() => {
						addEditTask();
					}}
				/>
			) : (
				<button
					aria-label="edit"
					className={styles.inputTaskEdit}
					onClick={() => {
						setIsEditMode(true);
					}}
				/>
			)}
			<button
				aria-label="remove"
				className={styles.inputTaskRemove}
				onClick={() => {
					if (confirm("Are you shure?")) {
						onRemoved(id);
					}
				}}
			/>
		</div>
	);
};
