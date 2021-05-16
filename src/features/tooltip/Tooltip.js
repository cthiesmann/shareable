import styles from './Tooltip.module.css'
import React from 'react'

export function Tooltip(props) {
	const { children, title } = props
	return (
		<div className={styles.tooltip}>
			{children}
			<span className={styles.tooltiptext}>{title}</span>
		</div>
	)
}