import moment from "moment-timezone";

const formatTampilanTanggal = (value) => {
    if (!value) {
        return null;
    }
    const dateTime = moment(value).tz('Asia/Tokyo');
    const year = dateTime.format('YYYY');
    const month = dateTime.format('MM');
    const day = dateTime.format('DD');
    return `${day}-${month}-${year}`;
};


export default formatTampilanTanggal;