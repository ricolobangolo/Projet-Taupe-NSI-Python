function showThemeNotification(theme) {
    const notification = document.createElement('div');
    notification.className = 'theme-notification';
    
    let message = '';
    switch(theme) {
        case 'dark':
            message = 'Mode sombre activé';
            break;
        case 'astigmatism':
            message = 'Mode astigmatisme activé';
            break;
        default:
            message = 'Mode clair activé';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
}
