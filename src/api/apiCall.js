const baseUrl = process.env.REACT_APP_API_URL;

const apiCall = async (endPoint, method = 'GET', data = []) => {
    try {
        const response = await fetch(`${baseUrl}${endPoint}`, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: method === 'GET' ? null : JSON.stringify(data)
        });
        const responseData = await response.json();

        if (response.ok) {
            return {
                ok: true,
                data: responseData.data,
                msg: responseData.message
            };
        } else {
            return {
                ok: false,
                msg: responseData.message
            };
        }
    } catch (err) {
        return {
            ok: false,
            msg: err.message
        };
    }
};
export default apiCall;
