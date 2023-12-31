//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";     

//core
import "primereact/resources/primereact.min.css";

//bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

import React, { useState, useEffect, useRef } from 'react';
import { Word } from "../../types/words/Word";
import FormWordMaintenanceList from "../../components/words/maintenance/FormWordMaintenanceList";
import getAllWords from "../../services/words/getAllWords";
import FormWordMaintenanceToolbar from "../../components/words/maintenance/FormWordMaintenanceToolbar/FormWordMaintenanceToolbar";
import FormWordMaintenanceDialog from "../../components/words/maintenance/FormWordMaintenanceDialog";
import FormWordDeleteDialog from "../../components/words/maintenance/FormWordDeleteDialog";
import { Toast } from 'primereact/toast';
import { MessageService } from "../../types/general/MessageService";
import { MSG_TYPE_SUCCESS } from "../../utils/constants/general/ConstantsRoutes";
import LayoutSidebar from "../../components/general/layout/LayoutSidebar";

const WordsPage = () => {
    const [words, setWords] = useState<Word[]>([]);
    const [visible, setWordDialogVisible] = useState<boolean>(false);
    const [deleteWordDialogVisible, setDeleteWordDialogVisible] = useState<boolean>(false);

    const [wordForm, setWordForm] = useState<Word>();
    const toast: any = useRef(null);
    const [context, setContext] = useState('');

    const fetchData = async () => {
        try{
            const response: MessageService = await getAllWords();
            
            if(response.type === MSG_TYPE_SUCCESS){
                setWords(response.data);
            }
            else{
                toast.current?.show({ severity: 'error', summary: 'Error', detail: response.message, life: 3000 });
            }
        }catch(error){

        }
    };

    const getUniqueContexts = (): string[] => {
        const stored: Set<string> = words.reduce((list, item)=>{
            if(item.context){
                list.add(item.context)
            }
            
            return list;
        }, new Set<string>());
        return Array.from(stored)
    }
    
    useEffect(() => {
        fetchData();
    }, []);
    

    return (
        <LayoutSidebar>
            <Toast ref={toast} />
            <div className="container pt-4">
            <h1 className="mb-4 text-center">Translation Maintenance</h1>
                <FormWordMaintenanceToolbar 
                    selectedWords={[]} 
                    setWordDialogVisible={setWordDialogVisible} 
                    setWordForm={setWordForm}
                    context={context}
                    setContext={setContext}
                    uniqueContexts={getUniqueContexts()}
                ></FormWordMaintenanceToolbar>
                <FormWordMaintenanceList setWords={setWords} words={words} setWordDialogVisible={setWordDialogVisible} setWordForm={setWordForm} setDeleteWordDialogVisible={setDeleteWordDialogVisible}></FormWordMaintenanceList>
            </div>
            <FormWordMaintenanceDialog 
                visible={visible} 
                setWordDialogVisible={setWordDialogVisible} 
                setWords={setWords} 
                wordForm={wordForm} 
                toast={toast} 
                setWordForm={setWordForm}
                globalContext={context}
            ></FormWordMaintenanceDialog>
            <FormWordDeleteDialog deleteWordDialogVisible={deleteWordDialogVisible} setWords={setWords} setDeleteWordDialogVisible={setDeleteWordDialogVisible} toast={toast} wordForm={wordForm}></FormWordDeleteDialog>
        </LayoutSidebar>
    );
}

export default WordsPage;
  