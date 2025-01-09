import './Modal.css'

export default function Modal({ onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Welcome to SocailSense AI</h2>
        <p className="modal-description">
          Your personal assistant for analyzing social media performance and suggesting improvement strategies.
        </p>
        <h3 className="modal-subtitle">What can I do?</h3>
        <ul className="modal-list">
          <li>lorem</li>
          <li> ipsum</li>
          <li>random</li>
          <li>random</li>
        </ul>
        <h3 className="modal-subtitle">How to use?</h3>
        <p className="modal-description">
          Simply type your questions or requests in the chat input, and I'll provide you with insights and recommendations based on your social media data.
        </p>
        <button onClick={onClose} className="modal-button">
          Get Started
        </button>
      </div>
    </div>
  )
}
