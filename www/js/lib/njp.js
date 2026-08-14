export class NJP{
    static parseNJP(data){
        const rdata = {};
        const jsob = [];
        const lines = data.split("\n");
        for(let i = 0; i < lines.length; i++){     
            const line = lines[i];           
            const parts = NJP.splitIn(line,":");
            try{
                const js = JSON.parse(parts[1]);
                jsob.push(js);
                rdata[parts[0]] = [js];
            }catch{
                rdata[parts[0]] = parts[1];
            }
        }
        return (rdata, jsob);
    }
    static splitIn(data, simbol){
        const index = data.indexOf(simbol);
        const fp = data.slice(0, index);
        const rest = data.slice(index + 1);
        return [fp, rest];
    }
}
