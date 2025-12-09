import { z } from "zod";
import { LCSC_uuid } from "./lcsc";

const PinSchema = () => z.object({
    pin_number: z
        .number()
        .describe('Pin number.'),
    name: z
        .string()
        .describe('Pin name (e.g., "VCC").'),
    signal_name: z
        .string()
        .describe('The name of the signal to which the pin is connected. (Only name)'),
});

const ComponentSchema = () => z.object({
    designator: z
        .string()
        .describe('Component identifier (e.g., "U1", "R5", "J1", "X1").'),
    value: z
        .string()
        .describe('Minimum description: for simple components — only the nominal value; for microcircuits — only the name. Only ASCII symbols (e.g., "LM358", "10nF", "100k").'),
    searchQuery: z
        .string()
        .describe('A component search question. For example: "1k 1W smd resistor," "LM358," "2-pin power connector"'),
    pins: z
        .array(PinSchema())
        .describe('Pin details.'),
    block_name: z
        .string()
        .describe('Reference to the block.'),
    partUuid: LCSC_uuid().nullable().describe("If you know the partUuid of the lcsc component, be sure to fill it in")
});

const ComponentWithPosSchema = () => z.object({
    designator: z
        .string()
        .describe('Component identifier (e.g., "U1", "R5", "J1", "X1").'),
    value: z
        .string()
        .describe('Minimum description: for simple components — only the nominal value; for microcircuits — only the name. Only ASCII symbols (e.g., "LM358", "10nF", "100k").'),
    pins: z
        .array(PinSchema())
        .describe('Pin details.'),
    block_name: z
        .string()
        .describe('Reference to the block.'),
    pos: z.object({
        x: z.number().describe("X position"),
        y: z.number().describe("Y position"),
        // pins: z.array(z.object({
        //     num: z.number().describe("Pin number"),
        //     x: z.number().describe("X position of the pin"),
        //     y: z.number().describe("Y position of the pin"),
        // })),
        width: z.number().describe("width position"),
        height: z.number().describe("height position"),
        rotate: z.number().optional()
    }).describe("Position of the component on the Circuit"),
    partUuid: LCSC_uuid().nullable().describe("If you know the partUuid of the lcsc component, be sure to fill it in")

});

const BlockSchema = () => z.object({
    name: z
        .string()
        .describe('Block short name (e.g., "Preamp").'),
    description: z
        .string()
        .describe('Block functionality.'),
    // parameters: z
    //     .record(z.string(), z.string())
    //     .describe('Block parameters (voltage, current, frequency range).')
    //     .nullable(),
    nextBlocks: z
        .array(z.string().describe("The name of the next block must be an existing name."))
});

const MetadataSchema = () => z.object({
    project_name: z
        .string()
        .describe('Project name.'),
    description: z
        .string()
        .describe('Circuit description.'),
});

export const CircuitStruct = () => z.object({
    metadata: MetadataSchema().describe('Metadata'),
    blocks: z.array(BlockSchema()).describe('Blocks'),
    components: z.array(ComponentSchema()).describe('Components'),
});

export const CircuitBlocksStruct = () => z.object({
    metadata: MetadataSchema().describe('Metadata'),
    blocks: z.array(BlockSchema()).describe('Blocks'),
});

export const CircuitWithotBlocksStruct = () => z.object({
    metadata: MetadataSchema().describe('Metadata'),
    components: z.array(ComponentSchema()).describe('Components'),
});

export const CircuitWithPosStruct = () => z.object({
    metadata: MetadataSchema().describe('Metadata'),
    components: z.array(ComponentWithPosSchema()).describe('Components'),
    edges: z.array(z.any()),
    blocks: z.array(BlockSchema()).describe('Blocks'),
    blocksRect: z.array(z.object({
        name: z
            .string()
            .describe('Block short name (e.g., "Preamp").'),
        description: z
            .string()
            .describe('Block functionality.'),
        x: z.number(),
        y: z.number(),
        width: z.number(),
        height: z.number(),
    })).optional()
});

// Схемы остаются без изменений
const ExplainPinSchema = () => z.object({
    pin_number: z.number().describe('Pin number.'),
    name: z.string().describe('Pin name (e.g., "VCC").'),
    signal_name: z.string().describe('The name of the signal to which the pin is connected. (Only name)'),
});

const ExplainComponentSchema = () => z.object({
    designator: z.string().describe('Component identifier (e.g., "U1", "R5", "J1", "X1").'),
    value: z.string().describe('Minimum description: for simple components — only the nominal value; for microcircuits — only the name. Only ASCII symbols (e.g., "LM358", "10nF", "100k").'),
    pins: z.array(ExplainPinSchema()).describe('Pin details.'),
    partUuid: LCSC_uuid().describe('Unique component identifier.'),
});

export const ExplainCircuitStruct = () => z.object({
    components: z.array(ExplainComponentSchema()).describe('Components'),
});

export const DiagnosticAlgoritm = () => z.object({});

export type ExplainCircuit = z.infer<ReturnType<typeof ExplainCircuitStruct>>;
export type CircuitWithPos = z.infer<ReturnType<typeof CircuitWithPosStruct>>;
export type CircuitWithoutBlocks = z.infer<ReturnType<typeof CircuitWithotBlocksStruct>>;
export type Circuit = z.infer<ReturnType<typeof CircuitStruct>>;
export type CircuitComponent = z.infer<ReturnType<typeof ComponentSchema>>;
export type Pin = z.infer<ReturnType<typeof PinSchema>>;
export type CircuitBlocks = z.infer<ReturnType<typeof CircuitBlocksStruct>>;
