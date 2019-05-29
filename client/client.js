const publicVapid = 'BLLRHxNsAOJtJf73pzOj7vIPlMHFKF0Fui-dV_ZYzxakfvffiw_lBfUXZz_agGecdW5tgvUAts_qyPHYyhfJQbA';

if ('serviceWorker' in navigator) {
    sendNotification().catch(err => console.error(err));
}

//register SW, register Push, send Push
async function sendNotification() {
    registerWorker('/worker.js', '/')
        .then(registration => {
            subscribeToPush(registration)
                .then(subscription => {
                    sendPushNotification(subscription)
                })
        });
}

function registerWorker(workerPath, scope) {
    return navigator.serviceWorker.register(workerPath, {
        scope: '/'
    });
}

function subscribeToPush(serviceWorkerRegistration) {
    return serviceWorkerRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapid)
    });
}

async function sendPushNotification(pushSubscription) {
    await fetch('/subscribe', {
        method: 'POST',
        body: JSON.stringify(pushSubscription),
        headers: {
            'content-type': 'application/json'
        }
    });
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}