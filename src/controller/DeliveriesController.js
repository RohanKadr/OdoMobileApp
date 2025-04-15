import { getDataUsingService } from "../services/Network";
import { Services } from "../services/UrlConstant";

export const getDeliveryOrderData = () => {
    return new Promise(async (resolve, reject) => {
        getDataUsingService(Services.deliveryOrders)
            .then((response) => {
                    const transformedData = transformData(response.result);
                    resolve(transformedData);
            }).catch((error) => {
                reject(error.message || "Failed to fetch data");
            });
    });
};

// Add the transform function to the controller
const transformData = (apiData) => {
    const transformedData = [];
    apiData.forEach(order => {
        order.products.forEach(product => {
            transformedData.push({
                id: `${order.id}-${product.product_id}`,
                customer: order.deliver_to,
                product: product.product,
                quantity: product.quantity,
                reference: order.name,
                scheduledDate: order.scheduled_date,
                Destination: order.destination_location,
                storagefacility: product.storage_facility,
                effectiveDate: order.effective_date,
                product_code: product.product_code,
            });
        });
    });
    return transformedData;
};