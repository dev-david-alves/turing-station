import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./Dialog";

import { Input } from "./Input";
import { Button } from "./Button";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./Select";
import { cn } from "../utils/cn";
import { Checkbox } from "./Checkbox";
import { RadioGroup, RadioGroupItem } from "./RadioGroup";

import { z } from "zod";
import { useSimulator } from "../providers/simulator";
import { SuccessToast } from "./Toast";

const CreateSimulatorModalSchema = z.object({
  name: z
    .string()
    .min(3, "Nome do simulador deve ter no mínimo 3 caracteres")
    .max(50, "Nome do simulador deve ter no máximo 50 caracteres"),
  variant: z.enum(["tm", "ndtm", "mttm"]),
  numTapes: z
    .number()
    .int()
    .min(2, "Número de fitas deve ser no mínimo 2")
    .max(5, "Número de fitas deve ser no máximo 5"),
});

import {
  deterministicExample01,
  nonDeterministicExample01,
  multitapeExample01,
} from "../p5-turing-machines/utils/examples";
import { checkFileFormat } from "../schemas/mtSchema";
import { texMapMatch } from "../p5-turing-machines/utils/transformInputText";
import { texMap } from "../p5-turing-machines/utils/getTexMaps";

const examples = {
  "0^n1^n": deterministicExample01,
  "010|00*1": nonDeterministicExample01,
  "a^nb^n_qualquer_order": multitapeExample01,
};

function CreateSimulatorModal() {
  const { simulatorInfo, setSimulatorInfo, generateRandomId } = useSimulator();

  const [useExample, setUseExample] = useState(false);
  const [name, setName] = useState("");
  const [stayOption, setStayOption] = useState(false);
  const [variant, setVariant] = useState("tm");
  const [numTapes, setNumTapes] = useState(2);
  const [erros, setErros] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const [example, setExample] = useState("import-from-device");
  const [useImportExample, setUseImportExample] = useState(false);
  const [importedFile, setImportedFile] = useState(null);

  useEffect(() => {
    setImportedFile(null);
    setUseImportExample(false);
    setErros([]);

    if (example === "import-from-device") {
      setUseImportExample(true);
    } else {
      setName(examples[example].name);
      setStayOption(examples[example].stayOption);
      setVariant(examples[example].variant);
      setNumTapes((prev) => (examples[example].variant === "mttm" ? examples[example].numTapes : prev));

      setImportedFile(examples[example]);
    }
  }, [example]);

  useEffect(() => {
    setImportedFile(null);
  }, [useExample]);

  const handleImportFile = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setErros([{ message: "Erro: nenhum arquivo selecionado!" }]);
      return;
    }

    if (file.type !== "application/json") {
      setErros([{ message: "Erro: arquivo não é um JSON!" }]);
      return { success: false, message: "Erro: arquivo não é um JSON!" };
    }

    let reader = new FileReader();
    reader.onload = (event) => {
      let result = JSON.parse(event.target.result);
      const parsed = checkFileFormat(result); // Use the schema to check the file format

      if (!parsed.success) {
        setErros([{ message: "Erro: arquivo não está no formato correto!" }]);
      } else {
        setImportedFile(parsed.data);
        setErros([]);
        setName(parsed.data.name);
        setStayOption(parsed.data.stayOption);
        setVariant(parsed.data.variant);
        setNumTapes((prev) => (parsed.data.variant === "mttm" ? parsed.data.numTapes : prev));
      }
    };

    reader.readAsText(file);
  };

  const handleChange = (e) => {
    let value = texMapMatch([e.target.value], texMap)[0];
    setName(value);
  };

  const handleSubmit = () => {
    const result = CreateSimulatorModalSchema.safeParse({
      name,
      variant,
      numTapes,
    });

    if (result.success) {
      const { name, variant, numTapes } = result.data;

      let nameAreadyExists = simulatorInfo.some((simulator) => simulator.name === name);
      if (nameAreadyExists) {
        setErros([{ message: "Nome do simulador já existe" }]);
        return;
      }

      setSimulatorInfo((prev) => [
        ...prev.map((simulator) => ({ ...simulator, open: false, fullScreen: false, focused: false })),
        {
          id: generateRandomId(),
          createdAt: new Date(),
          lastModified: new Date(),
          name,
          open: true,
          fullScreen: false,
          focused: true,
          showLeftToolbar: true,
          showTooltips: true,
          tm_variant: variant,
          tm_num_tapes: variant !== "mttm" ? 1 : numTapes,
          stayOption: stayOption,
          data: importedFile,
        },
      ]);

      setErros([]);
      setName("");
      setStayOption(false);
      setVariant("tm");
      setNumTapes(2);

      setUseExample(false);
      setExample("import-from-device");
      setUseImportExample(true);
      setImportedFile(null);
      setModalOpen(false);

      SuccessToast("Simulador criado com sucesso!")();
    } else {
      setErros(result.error.errors);
    }
  };

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>
        <Button className="text-white">Adicionar MT</Button>
      </DialogTrigger>
      <DialogContent className="dark-mode-variables w-[90%] bg-main sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-left text-white">Criar novo simulador</DialogTitle>
          <DialogDescription className="sr-only text-white">
            Crie um novo simulador de máquina de Turing com base em um exemplo ou do zero.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col justify-center">
          <div className="mb-2 flex w-full flex-col items-center gap-2 border-y border-gray-700 py-2 text-white">
            <div className="flex-items flex w-full justify-between">
              <label htmlFor="name" className="text-md font-semibold text-white">
                Com base em um exemplo?
              </label>
              <RadioGroup defaultValue="yes" value={useExample} onValueChange={(value) => setUseExample(value)}>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <RadioGroupItem id="yes" value={true} />
                    <label htmlFor="yes">Sim</label>
                  </div>
                  <div className="flex items-center gap-1">
                    <RadioGroupItem id="no" value={false} />
                    <label htmlFor="no">Não</label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {useExample && (
              <>
                <Select onValueChange={(value) => setExample(value)} defaultValue="import-from-device">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um exemplo" />
                  </SelectTrigger>
                  <SelectContent className="dark-mode-variables z-[50010]">
                    <SelectGroup>
                      <SelectItem value="import-from-device">Importar deste dispositivo</SelectItem>
                      <SelectLabel>Determinísticas</SelectLabel>
                      <SelectItem value="0^n1^n">0^n1^n</SelectItem>
                      <SelectLabel>Não determinísticas</SelectLabel>
                      <SelectItem value="010|00*1">010|00*1</SelectItem>
                      <SelectLabel>Multifitas</SelectLabel>
                      <SelectItem value="a^nb^n_qualquer_order">a^nb^n_qualquer_order</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                {useImportExample && (
                  <div className="flex w-full flex-col items-center gap-2">
                    <div className="flex w-full items-center gap-2">
                      <label htmlFor="import" className="text-md font-semibold text-white">
                        Importar
                      </label>
                      <Input id="import" type="file" className="hidden text-white" onChange={handleImportFile} />
                      <Button
                        className="w-full bg-darkenBlue text-white"
                        onClick={() => {
                          const input = document.getElementById("import");
                          input.click();
                        }}
                      >
                        Selecionar arquivo
                      </Button>
                    </div>
                    {importedFile && (
                      <span className="text-sm text-gray-500">
                        Arquivo importado: <span className="font-semibold">{importedFile?.name}</span>
                      </span>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          <div className="mb-2 flex flex-col justify-center gap-2 border-b border-gray-700 pb-2">
            <label htmlFor="name" className="text-md font-semibold text-white">
              Name
            </label>
            <Input id="name" placeholder="Nomear simulador" maxLength="50" value={name} onChange={handleChange} />
          </div>

          <div className="mb-2 flex items-center gap-2 border-b border-gray-700 pb-2">
            <Checkbox
              id="stay-option"
              className="text-white"
              checked={stayOption}
              onClick={() => setStayOption(!stayOption)}
            />
            <label htmlFor="stay-option" className="text-white">
              Opção de permanecer parado na fita
            </label>
          </div>

          {!useExample && (
            <>
              <div
                className={cn(
                  "flex w-full flex-col gap-2 border-b border-gray-700 pb-2",
                  variant === "mttm" && "border-b-0",
                )}
              >
                <label htmlFor="variant-type" className="text-md font-semibold text-white">
                  Escolher variante (Determinística por padrão)
                </label>
                <Select onValueChange={(value) => setVariant(value)} defaultValue="tm">
                  <SelectTrigger className="w-full">
                    <SelectValue id="variant-type" placeholder="Selecione uma variante" />
                  </SelectTrigger>
                  <SelectContent className="dark-mode-variables z-[50010]">
                    <SelectGroup>
                      <SelectItem value="tm">Determinística</SelectItem>
                      <SelectItem value="ndtm">Não determinística</SelectItem>
                      <SelectItem value="mttm">Multifitas</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {variant === "mttm" && (
                <div className="mb-2 flex items-center justify-center gap-2 border-b border-gray-700 pb-2">
                  <label htmlFor="numTapes" className="min-w-fit text-sm font-semibold text-white">
                    N° de fitas
                  </label>
                  <Input
                    id="numTapes"
                    placeholder="Número de fitas"
                    value={numTapes}
                    type="text"
                    onChange={(e) => {
                      let value = e.target.value;

                      const regex = /^[0-9]*$/;

                      if (!regex.test(value)) {
                        return;
                      }

                      if (value.length === 0) {
                        setNumTapes(0);
                        return;
                      }

                      setNumTapes(parseInt(value));
                    }}
                  />
                </div>
              )}
            </>
          )}

          {erros.length > 0 && (
            <div className="flex flex-col gap-2 text-red-500">
              {erros.map((erro, index) => (
                <span key={index}>{erro.message}</span>
              ))}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button className="w-24 bg-darkGreen text-white" onClick={handleSubmit}>
            Criar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateSimulatorModal;
