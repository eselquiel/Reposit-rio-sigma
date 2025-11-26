document.addEventListener('DOMContentLoaded', () => {
  const notification = document.getElementById('notification');

  function showNotification(message, ms = 3500) {
    if (!notification) { alert(message); return; }
    notification.textContent = message;
    notification.hidden = false;
    notification.classList.add('visible');
    clearTimeout(notification._hideTimeout);
    notification._hideTimeout = setTimeout(() => {
      notification.classList.remove('visible');
      notification.hidden = true;
    }, ms);
  }


  document.querySelectorAll('.play-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const gameName = btn.dataset.game || 'Game';
      showNotification('Game Launched!');
      console.log('Game Launched!');
    });
  });

  document.querySelectorAll('.purchase-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      showNotification('Purchase Complete!');
      console.log('Purchase Complete!');
    });
  });
});
