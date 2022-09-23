//
// Created by shirejoni on 7/18/22.
//

#ifndef GIAHINO_DEV_TEMPLATE_H
#define GIAHINO_DEV_TEMPLATE_H

#include "Arduino.h";

const char IndexPage[] PROGMEM = R"=====(
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Giahino | Wifi List</title>
    <link rel="preconnect" href="//fdn.fontcdn.ir">
    <link rel="preconnect" href="//v1.fontapi.ir">
    <link href="https://v1.fontapi.ir/css/Shabnam" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: "Shabnam";
        }

        a {
            text-decoration: none;
        }

        body {
            font: 10px "Shabnam";
            background: #f7f1f1;
        }

        .wrapper {
            max-width: 360px;
            margin: 50px auto;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        nav {
            display: flex;
            align-items: center;
            background-color: white;
            width: 336px;
            justify-content: space-around;
            border-radius: 8px;
        }
        nav a {
            color: #1c9cea;
            font-weight: bold;
            font-size: 16px;
            display: inline-block;
            padding: 10px 15px;
        }

    </style>
</head>
<body>
<div class="wrapper">
    <nav>
        <a href="/connection">لیست شبکه ها</a>
        <a href="/token">ورود دستگاه</a>
    </nav>

</div>

<script type="text/javascript">

</script>
</body>
</html>
)=====";


const char TokenPage[] PROGMEM = R"=====(
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Giahino | Wifi List</title>
    <link rel="preconnect" href="//fdn.fontcdn.ir">
    <link rel="preconnect" href="//v1.fontapi.ir">
    <link href="https://v1.fontapi.ir/css/Shabnam" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: "Shabnam";
        }

        a {
            text-decoration: none;
        }

        body {
            font: 10px "Shabnam";
            background: #f7f1f1;
        }

        .wrapper {
            max-width: 360px;
            margin: 50px auto;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        nav {
            width: 336px;
            background-color: white;
            border-radius: 15px;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px 8px;
        }

        .status {
            font-size: 16px;
            color: #12d038;
            direction: rtl;
        }

        .error {
            font-size: 16px;
            color: #dc0b3c;
            direction: rtl;
        }

        .logout {
            background-color: #1c9cea;
            color: white;
            font-weight: 500;
            cursor: pointer;
            width: 75px;
            height: 35px;
            display: flex;
            justify-content: center;
            align-items: center;
            border: none;
            border-radius: 8px;
            margin-top: 20px;
        }

        .input {
            direction: ltr;
            display: flex;
            align-items: center;
            width: 100%;
            justify-content: center;
            margin: 10px 0;
        }

        .input input {
            min-height: 35px;
            border-radius: 15px 0 0 15px;
            border: 1px solid #1c9cea;
            padding: 0 10px;
            font-size: 15px;
            width: 200px;
            outline: none;
        }

        .input .add {
            background-color: #1c9cea;
            border: none;
            min-height: 35px;
            padding: 7px 25px;
            border-radius: 0 15px 15px 0;
            color: white;
            cursor: pointer;
        }
    </style>
</head>
<body>
<div class="wrapper">
    <nav>
        <span class="error"></span>
        <span class="status"></span>
        <div class="input">
            <input type="text" placeholder="device token" pattern="[0-9]*" inputMode="numeric">
            <button class="add">ثبت</button>
        </div>
        <button class="logout">خارج شدن</button>
    </nav>

</div>

<script type="text/javascript">
    const statusElement = document.querySelector(".status");
    const logOutElement = document.querySelector(".logout");
    const errorElement = document.querySelector(".error");
    const inputBoxElement = document.querySelector(".input");

    const successMessage = "دستگاه با موفقیت وارد شده است.";
    const errorMessage = "خطایی در افزودن دستگاه رخ داده است";
    const addMessage = "کد دستگاه را وارد کنید";
    const isLoadingMessage = "منتظر بمانید ...";
    const StatusEnum = {
        Loading: "loading",
        LoggedIn: "true",
        Error: "error",
        Initial: "false"
    }
    let status = StatusEnum.Initial;
    const renderStatus = () => {
        logOutElement.style.display = "none";
        errorElement.style.display = "none";
        inputBoxElement.style.display = "none";
        switch (status) {
            case StatusEnum.LoggedIn: {
                logOutElement.style.display = "flex";
                statusElement.innerHTML = successMessage;
                statusElement.style.color = "#12d038";
                return;
            }
            case StatusEnum.Loading: {
                statusElement.style.color = "black";
                statusElement.innerHTML = isLoadingMessage;
                return;
            }
            case StatusEnum.Error: {
                errorElement.style.display = "flex";
                errorElement.innerHTML = errorMessage;
            }
            case StatusEnum.Initial: {
                statusElement.style.color = "black";
                statusElement.innerHTML = addMessage;
                inputBoxElement.style.display = "flex";
            }
        }

    }
    const request = (status) => {
        return new Promise((res, rej) => {
            setTimeout(() => {
                res(status);
            }, 1000);
        })

    }

    const logOut = async () => {
        try {
            status = StatusEnum.Loading;
            renderStatus();
            const response = await fetch("http://192.168.4.1/token/logout");
            const result = await response.text();
            status = result;
            renderStatus();
            setTimeout(fetchStatus, 1000);
        } catch (error) {
            console.log(error);
            status = StatusEnum.Error;
            renderStatus();

        }
    }
    const logIn = async () => {
        try {
            const inputElement = inputBoxElement.querySelector("input");
            const token = inputElement.value;
            if(!token) {
                return;
            }
            status = StatusEnum.Loading;
            renderStatus();
            const response = await fetch("http://192.168.4.1/token/login/" + token);
            const result = await response.text();
            status = result;
            renderStatus();
            setTimeout(fetchStatus, 1000);
        } catch (error) {
            console.log(error);
            status = StatusEnum.Error;
            renderStatus();

        }
    }
    let timeOut
    const fetchStatus = async () => {
        try {
            clearTimeout(timeOut);
            const response = await fetch("http://192.168.4.1/token/status");
            const result = await response.text();
            status = result;
            renderStatus();
            if(result === StatusEnum.Loading) {
                setTimeout(fetchStatus, 2000);
            }
        } catch (error) {
            console.log(error);
            status = StatusEnum.Error;
            renderStatus();
        }
    }

    logOutElement.addEventListener("click", logOut);
    inputBoxElement.querySelector(".add").addEventListener("click", logIn);

    renderStatus();
    fetchStatus();

</script>
</body>
</html>
)=====";

const char WifiPage[] PROGMEM = R"=====(
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Giahino | Wifi List</title>
    <link rel="preconnect" href="//fdn.fontcdn.ir">
    <link rel="preconnect" href="//v1.fontapi.ir">
    <link href="https://v1.fontapi.ir/css/Shabnam" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: "Shabnam";
        }

        a {
            text-decoration: none;
        }

        body {
            font: 10px "Shabnam";
            background: #f7f1f1;
        }

        .wrapper {
            max-width: 360px;
            margin: 50px auto;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .network-container {
            width: 100%;
            max-width: 336px;
            background-color: white;
            border-radius: 15px;
            padding: 10px;
            direction: rtl;
        }

        .network-header {
            display: flex;
            align-items: center;
            width: 100%;
            justify-content: space-between;
            border-bottom: 1px solid #EBECF0;
            padding-bottom: 10px;

        }

        .title {
            font-size: 2rem;
            margin-bottom: 2rem;
        }

        .network-title {
            font-size: 1.4rem;
        }

        .network-buttons {
            display: flex;
            align-items: center;
        }

        .network-button {
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #4eb3f1;
            border: none;
            padding: 8px 10px;
            margin-right: 10px;
            cursor: pointer;
            color: white;
            border-radius: 8px;
        }

        .network-button:hover {
            background-color: #3589bc;
        }

        .network-list {
            direction: ltr;
            display: flex;
            flex-direction: column;
            padding: 10px 0 0 0;
        }

        .network-list .network-item {
            display: flex;
            align-items: center;
            height: 40px;
            padding: 0 8px;
            justify-content: space-between;
        }

        .network-list .network-item .icons svg {
            width: 16px;
            height: 16px;
        }

        .network-list .network-item:hover {
            background-color: #4eb3f1;
            color: white;
        }

        .network-modal-body {
            position: fixed;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.4);
            z-index: 100;
            top: 0;
            left: 0;
            display: none;
            justify-content: center;
            align-items: center;
        }

        .network-modal {
            width: 100%;
            max-width: 336px;
            background-color: white;
            border-radius: 15px;
            padding: 10px;
            direction: rtl;
        }

        .form-row {
            display: flex;
            align-items: center;
        }

        .field {
            height: 40px;
            width: 100%;
            border-radius: 8px;
            border: 1px solid #EBECF0;
            direction: ltr;
            font-size: 16px;
            padding: 0 7px;
            margin: 5px 0;
        }

        .label {
            font-size: 14px;
            display: flex;
            flex-shrink: 0;
            width: 75px;
        }

        .submit {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #4eb3f1;
            height: 40px;
            margin-top: 5px;
            border: none;
            cursor: pointer;
            color: white;
            border-radius: 8px;
        }
    </style>
</head>
<body>
<div class="wrapper">
    <div class="network-modal-body">
        <div class="network-modal">
            <div class="form-row">
                <label for="ssid" class="label">نام شبکه*:</label>
                <input id="ssid" class="field" type="text">
            </div>
            <div class="form-row">
                <label for="password" class="label">رمزعبور:</label>
                <input id="password" class="field" type="password">
            </div>
            <div class="form-row">
                <label class="label" for="submit"></label>
                <button class="submit" id="submit">افزودن</button>
            </div>

        </div>
    </div>
    <h1 class="title">توانا</h1>
    <div class="network-container">
        <div class="network-header">
            <span class="network-title">شبکه های موجود</span>
            <div class="network-buttons">
                <button class="network-button network-disconnect">قطع</button>
                <button class="network-button network-plus">+</button>
                <button class="network-button network-search">جستجو</button>
            </div>
        </div>
        <div class="network-list">

            <div class="network-item">
                <h3>Ghiahino-dev</h3>
            </div>
            <div class="network-item">
                <h3>Redmi</h3>
            </div>
        </div>
        <div class="icons">

        </div>

    </div>
</div>

<script type="text/javascript">


    const ConnectionStatus = {
        Disconnected: 1,
        Connecting: 2,
        Connected: 3,
    }
    const networkStatus = {
        status: ConnectionStatus.Disconnected,
        ssid: undefined,
    };
    let wifiList = [];


    const lockSvg = `<svg fill="#000000" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px">    <path d="M 12 1 C 8.6761905 1 6 3.6761905 6 7 L 6 8 C 4.9 8 4 8.9 4 10 L 4 20 C 4 21.1 4.9 22 6 22 L 18 22 C 19.1 22 20 21.1 20 20 L 20 10 C 20 8.9 19.1 8 18 8 L 18 7 C 18 3.6761905 15.32381 1 12 1 z M 12 3 C 14.27619 3 16 4.7238095 16 7 L 16 8 L 8 8 L 8 7 C 8 4.7238095 9.7238095 3 12 3 z M 12 13 C 13.1 13 14 13.9 14 15 C 14 16.1 13.1 17 12 17 C 10.9 17 10 16.1 10 15 C 10 13.9 10.9 13 12 13 z"/></svg>`
    const penSvg = `<svg class="pen" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M497.9 74.16L437.8 14.06c-18.75-18.75-49.19-18.75-67.93 0l-56.53 56.55l127.1 128l56.56-56.55C516.7 123.3 516.7 92.91 497.9 74.16zM290.8 93.23l-259.7 259.7c-2.234 2.234-3.755 5.078-4.376 8.176l-26.34 131.7C-1.921 504 7.95 513.9 19.15 511.7l131.7-26.34c3.098-.6191 5.941-2.141 8.175-4.373l259.7-259.7L290.8 93.23z"/></svg>`;
    const wifiSvgs = {
        1: `<svg height="48" viewBox="0 0 48 48" width="48" xmlns="http://www.w3.org/2000/svg"><path d="M24.02 42.98l23.26-28.98c-.9-.68-9.85-8-23.28-8-13.43 0-22.38 7.32-23.28 8l23.26 28.98.02.02.02-.02z" fill-opacity=".3"/><path d="M0 0h48v48h-48z" fill="none"/></svg>`,
        2: `<svg height="48" viewBox="0 0 48 48" width="48" xmlns="http://www.w3.org/2000/svg"><path d="M24.02 42.98l23.26-28.98c-.9-.68-9.85-8-23.28-8s-22.38 7.32-23.28 8l23.26 28.98.02.02.02-.02z" fill-opacity=".3"/><path d="M0 0h48v48h-48z" fill="none"/><path d="M13.34 29.72l10.65 13.27.01.01.01-.01 10.65-13.27c-.53-.41-4.6-3.72-10.66-3.72s-10.13 3.31-10.66 3.72z"/></svg>`,
        3: `<svg height="48" viewBox="0 0 48 48" width="48" xmlns="http://www.w3.org/2000/svg"><path d="M24.02 42.98l23.26-28.98c-.9-.68-9.85-8-23.28-8s-22.38 7.32-23.28 8l23.26 28.98.02.02.02-.02z" fill-opacity=".3"/><path d="M0 0h48v48h-48z" fill="none"/><path d="M9.58 25.03l14.41 17.95.01.02.01-.02 14.41-17.95c-.72-.56-6.22-5.03-14.42-5.03s-13.7 4.47-14.42 5.03z"/></svg>`,
        4: `<svg height="48" viewBox="0 0 48 48" width="48" xmlns="http://www.w3.org/2000/svg"><path d="M24.02 42.98l23.26-28.98c-.9-.68-9.85-8-23.28-8s-22.38 7.32-23.28 8l23.26 28.98.02.02.02-.02z" fill-opacity=".3"/><path d="M0 0h48v48h-48z" fill="none"/><path d="M7.07 21.91l16.92 21.07.01.02.02-.02 16.92-21.07c-.86-.66-7.32-5.91-16.94-5.91-9.63 0-16.08 5.25-16.93 5.91z"/></svg>`,
        5: `<svg height="48" viewBox="0 0 48 48" width="48" xmlns="http://www.w3.org/2000/svg"><path d="M24.02 42.98l23.26-28.98c-.9-.68-9.85-8-23.28-8s-22.38 7.32-23.28 8l23.26 28.98.02.02.02-.02z"/><path d="M0 0h48v48h-48z" fill="none"/></svg>`
    }
    const loadingSvg = `<svg width="38" height="38" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient x1="8.042%" y1="0%" x2="65.682%" y2="23.865%" id="a">
                <stop stop-color="#000" stop-opacity="0" offset="0%"/>
                <stop stop-color="#000" stop-opacity=".631" offset="63.146%"/>
                <stop stop-color="#000" offset="100%"/>
            </linearGradient>
        </defs>
        <g fill="none" fill-rule="evenodd">
            <g transform="translate(1 1)">
                <path d="M36 18c0-9.94-8.06-18-18-18" id="Oval-2" stroke="url(#a)" stroke-width="2">
                    <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="0.9s" repeatCount="indefinite"/>
                </path>
                <circle fill="#000" cx="36" cy="18" r="1">
                    <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="0.9s" repeatCount="indefinite"/>
                </circle>
            </g>
        </g>
    </svg>`
    const tickSVg = `<svg data-name="Capa 1" id="Capa_1" viewBox="0 0 20 19.84" xmlns="http://www.w3.org/2000/svg"><path d="M15.39,5.66a.37.37,0,0,0-.52,0L8,13.39,5.09,11.06a.38.38,0,1,0-.47.59L7.85,14.2a.38.38,0,0,0,.52,0l7.06-8A.38.38,0,0,0,15.39,5.66Z"/></svg>`;
    const networkListElement = document.querySelector(".network-list");
    const networkAddButton = document.querySelector(".network-plus");
    const networkSearchButton = document.querySelector(".network-search");
    const networkDisconnectButton = document.querySelector(".network-disconnect");
    const modalBody = document.querySelector(".network-modal-body");
    const modal = document.querySelector(".network-modal");
    const ssidInput = document.querySelector("#ssid");
    const passwordInput = document.querySelector("#password");
    const submit = document.querySelector("#submit");

    const displayModel = () => {
        modalBody.style.display = "flex";
        ssidInput.value = "";
        passwordInput.value = "";
    }
    const closeModal = () => {
        modalBody.style.display = "none";
    }

    modalBody.addEventListener("click", (event) => {
        if(!modal.sensorItemsContain(event.target)) {
            closeModal();
        }
    })

    networkAddButton.addEventListener("click", () => {
        displayModel();
    })


    submit.addEventListener("click", () => {
        const value = ssidInput.value.trim();
        const password = passwordInput.value.trim();
        if(password.length > 0 && password.length < 8 || !value) {
            return;
        }
        const index = wifiList.findIndex((f) => f.ssid === value);
        if(index < 0) {
            wifiList.push({
                ssid: value,
                password: password ? password : undefined,
                locked: Boolean(password)
            })
        }else {
            wifiList[index].password = password;
        }
        renderNetworkList();
        closeModal();
    })
    const getIconQuality = (quality) => {
        const number = Math.min(Math.floor(quality / 20) + 1, 5);
        return wifiSvgs[number] ?? wifiSvgs[1];
    }



    // timouts
    let networkStatusTimeOutHandler, networkListTimeoutHandler;

    const checkNetworkStatus = async () => {
        if (networkStatusTimeOutHandler) {
            clearTimeout(networkStatusTimeOutHandler);
        }
        try {
            const result = await fetch("http://192.168.4.1/connection/status")
            const text = await result.text();
            if (text.trim().includes(",")) {
                const [connecting, ssid] = text.split(",");
                networkStatus.status = ["1"].includes(connecting) ? ConnectionStatus.Connecting : ConnectionStatus.Connected;
                networkStatus.ssid = ssid;
            } else {
                networkStatus.status = ConnectionStatus.Disconnected;
                networkStatus.ssid = undefined;
            }
        } catch (error) {
            console.log("checkNetworkStatus", error);
            networkStatus.status = ConnectionStatus.Disconnected;
            networkStatus.ssid = undefined;
        }
        networkStatusTimeOutHandler = setTimeout(checkNetworkStatus, 3000);
    }

    const connectToNetwork = async (ssid, password = undefined) => {
        try {
            const result = await fetch(`http://192.168.4.1/connection/connect/${ssid}` + (password ? `/${password}` :""))
            const text = await result.text();
        } catch (error) {
            console.log("checkNetworkStatus", error);
            networkStatus.status = ConnectionStatus.Disconnected;
            networkStatus.ssid = undefined;
        }
    }

    const fetchNetworkList = async () => {
        if (networkListTimeoutHandler) {
            clearTimeout(networkListTimeoutHandler);
        }
        try {
            const result = await fetch("http://192.168.4.1/connection/list");
            const text = await result.text();
            const rows = text.split("\n").filter(Boolean).filter((row) => row.includes(","));
            if (rows.length > 0) {
                const newList = rows.map((row) => {
                    const [ssid, lock, hidden, quality] = row.split(',')
                    return {
                        ssid,
                        hidden: hidden === "1",
                        locked: lock === "1",
                        quality: Number(quality)
                    }
                });
                wifiList = wifiList.filter((w) => w.isCustom || newList.find((l) => l.ssid === w.ssid) != null);
                newList.forEach((wifi) => {
                    const index = wifiList.findIndex((w) => w.ssid === wifi.ssid);
                    if (index < 0) {
                        wifiList.push(wifi)
                        return;
                    }
                    wifiList[index] = {
                        ...wifiList[index],
                        quality: wifi.quality,
                        locked: wifi.locked,
                    }
                })

                wifiList = wifiList.filter((w) => !w.hidden).sort((a, b) => a.quality < b.quality);
            } else {
                wifiList = [];
            }
            renderNetworkList();
        } catch (error) {
            console.log("fetchNetworkList", error);
        }
        networkListTimeoutHandler = setTimeout(fetchNetworkList, 10000);


    }


    const renderNetworkList = () => {
        const handleOnNetworkItemClicked = (item) => () => {
            if(item.locked && !item.password) {
                displayModel();
                ssidInput.value = item.ssid;
                return;
            }
            connectToNetwork(item.ssid, item.password);
            networkStatus.status = ConnectionStatus.Connecting;
            networkStatus.ssid = item.ssid;
            renderNetworkList();
        }
        const networkItems = wifiList.map((item) => {
            const element = document.createElement("div");
            element.classList.add("network-item");
            const isConnected = networkStatus.ssid === item.ssid && networkStatus.status === ConnectionStatus.Connected;
            const isConnecting = networkStatus.ssid === item.ssid && networkStatus.status === ConnectionStatus.Connecting;
            const icons = [
                isConnected && tickSVg,
                isConnecting && loadingSvg,
                item.password != null && penSvg,
                item.locked && lockSvg,
                item.quality != null && getIconQuality(item.quality)
            ].filter(Boolean)
            element.innerHTML = `
                <h3>${item.ssid}</h3>
                <div class="icons">
                ${icons.join(" ")}
                </div>
            `;
            element.addEventListener("click", handleOnNetworkItemClicked(item))
            const d = element.querySelector(".pen");
            if(d) {
                d.addEventListener("click", () => {
                    displayModel();
                    ssidInput.value = item.ssid;
                });
            }
            return element;
        })
        networkListElement.innerHTML = "";
        networkListElement.append(...networkItems);
        networkDisconnectButton.style.display = networkStatus.status === ConnectionStatus.Connected ? "block" : "none";

    }


    networkSearchButton.addEventListener("click", () => {
        fetchNetworkList();
    })

    checkNetworkStatus();
    fetchNetworkList();
    renderNetworkList();
</script>
</body>
</html>
)=====";

#endif //GIAHINO_DEV_TEMPLATE_H
