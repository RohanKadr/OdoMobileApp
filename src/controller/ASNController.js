import { getDataUsingService } from "../services/Network";
import { Services } from "../services/UrlConstant";

export const getpurchaseOrderData = () => {
    return new Promise(async (resolve, reject) => {
        getDataUsingService(Services.purchaseOrders)
            .then((response) => {
                    const transformedData = transformData(response.result);
                    resolve(transformedData);
            }).catch((error) => {
                reject(error.message || "Failed to fetch data");
            });
    });
};

const transformData = (apiData) => {
    const transformedData = [];
    apiData.forEach(order => {
        order.products.forEach(product => {
            transformedData.push({
                id: '${order.id}-${product.product_id}',
                vendor: order.vendor,
                product: product.product,
                quantity: product.quantity,
                reference: order.name,
                confirmationDate: order.confirmation_date,
                buyer: "Administrator",
                receivedquantity: product.received_qty,
                expectedArrival: order.expected_arrival,
                product_code: product.product_code
            });
        });
    });
    return transformedData;
};