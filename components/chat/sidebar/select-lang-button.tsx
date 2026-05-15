import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React from "react";

import { languages } from "@/constants/language";


type props = {
    value: string,
    onChange: (value: string) => void
}


const SelectLangButton = ({value, onChange}: props) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select language" />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang)=>
            <SelectItem key={lang.code} value={lang.code}>{lang.label}</SelectItem>
        )}
      </SelectContent>
    </Select>
  );
};

export default SelectLangButton;
