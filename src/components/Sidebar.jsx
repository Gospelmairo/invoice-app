import { useTheme } from '../context/ThemeContext';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className={styles.sidebar} aria-label="Application sidebar">
      <div className={styles.logo} aria-label="Invoice App">
        <span className={styles.logoIcon}>⚡</span>
      </div>

      <div className={styles.bottom}>
        <button
          className={styles.themeBtn}
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        <div className={styles.avatar} aria-label="User avatar">
          GM
        </div>
      </div>
    </aside>
  );
}
