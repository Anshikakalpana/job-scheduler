const dlqProducer = async(data:any)=>{

    if(!data) throw new Error("No data provided to DLQ producer");

    if(data.actualTries===data.maxTries){
        data.failureType = 'POISON';
    }
    else if(data.actualTries < data.maxTries){
        data.failureType = 'TEMPORARY';
    }

}