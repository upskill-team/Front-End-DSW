import { useMutation } from "@tanstack/react-query";
import { unitService } from "../api/services/unit.service.ts";


export const useUploadUnitFile = () => {
  return useMutation({
    mutationFn: (file: File) => unitService.uploadFile(file),
  });
}