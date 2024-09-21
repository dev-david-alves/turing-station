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
import { useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./Select";
import { cn } from "../utils/cn";
import { Checkbox } from "./Checkbox";
import { RadioGroup, RadioGroupItem } from "./RadioGroup";

import { z } from "zod";
import { useSimulator } from "../providers/simulator";

const CreateSimulatorModalSchema = z.object({
  example: z.boolean(),
  name: z
    .string()
    .min(3, "Nome do simulador deve ter no mínimo 3 caracteres")
    .max(50, "Nome do simulador deve ter no máximo 50 caracteres"),
  stayOption: z.boolean(),
  variant: z.enum(["tm", "ndtm", "mttm"]),
  numTapes: z
    .number()
    .int()
    .min(1, "Número de fitas deve ser no mínimo 1")
    .max(3, "Número de fitas deve ser no máximo 3"),
});

function CreateSimulatorModal() {
  const { simulatorInfo, setSimulatorInfo, generateRandomId } = useSimulator();

  const [example, setExample] = useState(false);
  const [name, setName] = useState("");
  const [stayOption, setStayOption] = useState(false);
  const [variant, setVariant] = useState("tm");
  const [numTapes, setNumTapes] = useState(1);
  const [erros, setErros] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const handleSubmit = () => {
    const result = CreateSimulatorModalSchema.safeParse({
      example,
      name,
      stayOption,
      variant,
      numTapes,
    });

    if (result.success) {
      const { example, name, stayOption, variant, numTapes } = result.data;

      let nameAreadyExists = simulatorInfo.some((simulator) => simulator.name === name);
      if (nameAreadyExists) {
        setErros([{ message: "Nome do simulador já existe" }]);
        return;
      }

      setSimulatorInfo((prev) => [
        ...prev.map((simulator) => ({ ...simulator, open: false, fullScreen: false, focused: false })),
        {
          id: generateRandomId(),
          name,
          open: true,
          fullScreen: false,
          focused: true,
          showLeftToolbar: true,
          showTooltips: true,
          tm_variant: variant,
          tm_num_tapes: numTapes,
          stayOption: stayOption,
          data: undefined,
        },
      ]);

      setModalOpen(false);
      setErros([]);
      setExample(false);
      setName("");
      setStayOption(false);
      setVariant("tm");
      setNumTapes(1);
    } else {
      setErros(result.error.errors);
    }
  };

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>
        <Button className="text-white">Adicionar MT</Button>
      </DialogTrigger>
      <DialogContent className="dark-mode-variables z-[30000] w-[90%] bg-main sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-left text-white">Criar novo simulador</DialogTitle>
          {/* <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription> */}
        </DialogHeader>
        <div className="flex flex-col justify-center">
          {/*<div className="mb-2 flex w-full flex-col items-center gap-2 border-y border-gray-700 py-2 text-white">
             <div className="flex-items flex w-full justify-between">
              <label htmlFor="name" className="text-md font-semibold text-white">
                Com base em um exemplo?
              </label>
              <RadioGroup defaultValue="yes" value={example} onValueChange={(value) => setExample(value)}>
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

           {example && (
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um exemplo" />
                </SelectTrigger>
                <SelectContent className="dark-mode-variables z-[30010]">
                  <SelectGroup>
                    <SelectLabel>Determinísticas</SelectLabel>
                    <SelectItem value="0^n1^n">0^n1^n</SelectItem>
                    <SelectLabel>Não determinísticas</SelectLabel>
                    <SelectItem value="010|00*1">010|00*1</SelectItem>
                    <SelectLabel>Multifitas</SelectLabel>
                    <SelectItem value="a^nb^n_qualquer_order">a^nb^n_qualquer_order</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )} 
          </div> */}

          <div className="mb-2 flex flex-col justify-center gap-2 border-b border-gray-700 pb-2">
            <label htmlFor="name" className="text-md font-semibold text-white">
              Name
            </label>
            <Input
              id="name"
              placeholder="Nomear simulador"
              maxLength="50"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
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

          {!example && (
            <div
              className={cn(
                "flex w-full flex-col gap-2 border-b border-gray-700 pb-2",
                variant === "mttm" && "border-b-0",
              )}
            >
              <label htmlFor="variant-type" className="text-md font-semibold text-white">
                Escolher variante (Determinística por padrão)
              </label>
              <Select onValueChange={(value) => setVariant(value)} value={variant}>
                <SelectTrigger className="w-full">
                  <SelectValue id="variant-type" placeholder="Selecione uma variante" />
                </SelectTrigger>
                <SelectContent className="dark-mode-variables z-[30010]">
                  <SelectGroup>
                    <SelectItem value="tm">Determinística</SelectItem>
                    <SelectItem value="ndtm">Não determinística</SelectItem>
                    <SelectItem value="mttm">Multifitas</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )}

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
