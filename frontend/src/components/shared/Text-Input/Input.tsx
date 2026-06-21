import styles from "./Input.module.css"
import type { InputHTMLAttributes } from "react"

const Input = (props: InputHTMLAttributes<HTMLInputElement>) => {
    return (
        <input 
            className={styles.input}
            type="text"
            {...props}
        />
    )
}

export default Input