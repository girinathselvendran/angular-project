export enum PageMode{
    Add = 1,
    Edit
}

export enum Seviority{
    success = 1,
    error,
    info,
    warn
}

export class ConfigData {
    public static pageModes = {
        1:{
            label: 'CREATE'
        },
        2:{
            label: 'EDIT'
        }
    }
}