export const isEasyEda = () => 'eda' in window;

export const showToastMessage = (mes: string, type: "error" | "warn" | "info" | "success" | "question") => isEasyEda() ? eda.sys_Message.showToastMessage(mes, type as ESYS_ToastMessageType) : console.trace(mes)

export const getUserAuth = () => {
    const encode = (payload: unknown) => btoa(JSON.stringify(payload));

    if (!isEasyEda()) return encode({
        username: 'test',
        uuid: 'test'
    });

    const userInfo = eda.sys_Environment.getUserInfo();

    return encode({
        username: userInfo.username,
        uuid: userInfo.uuid
    });
}