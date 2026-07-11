export enum OrderStatus {
    PAUSE = "PAUSE",   //1 kutulishda deyda tolov qilsak 
    PROCESS = "PROCESS", //2 Tolov qilsak PROCESSga otadi & dastavka qilishga otadi 
    FINISH = "FINISH", //3 Finish ga yol oladi
    DELETE = "DELETE", // 3 PAUSE turib mahsulot olmasak delete statusga ozgaradi

}