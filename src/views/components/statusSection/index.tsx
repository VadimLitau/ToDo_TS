import styles from "./index.module.scss";

interface IStatusSection {
	size: number;
	statusName: string;
	statusText: string;
}

export const StatusSection: React.FC<IStatusSection> = ({
	size,
	statusName,
	statusText,
}) => {
	return size === 0 ? (
		<>
			<p className={styles.taskStatus}>{statusName}</p>
			<div className={styles.inputTask}>
				<h3>{statusText}</h3>
			</div>
		</>
	) : (
		<p className={styles.taskStatus}>{statusName}</p>
	);
};
