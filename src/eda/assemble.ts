import type { CircuitAssembly } from "./../types/circuit";

interface Offset {
    x: number | undefined;
    y: number | undefined
}

interface PlacedComponents {
    [k: string]: {
        primitive_id: string;
        pins: ISCH_PrimitiveComponentPin[];
        designator: string;
    };
}

const to2 = (x: number) => { x = Math.round(x); return x - (x % 5); }

const applyOffset = (x: number, y: number, offset: Offset) => {

    if (offset.x) x = offset.x + x;
    if (offset.y) y = offset.y - y;

    return { x, y };
}

function chunkArray(arr: any[], size: number) {
    const chunkedArr = [];
    for (let i = 0; i < arr.length; i += size) {
        chunkedArr.push(arr.slice(i, i + size));
    }
    return chunkedArr;
}

async function createComponet(component: CircuitAssembly['components'][0], offset: Offset = { x: 0, y: 0 }) {
    let comp: ISCH_PrimitiveComponent | ISCH_PrimitiveComponent_2 | undefined;
    const { part_uuid: partUuid, designator, pos } = component;
    if (!partUuid) throw new Error("createComponet partUuid not found");

    const { x, y } = applyOffset(pos.x + (pos.center?.x ?? (pos.width / 2)), (pos.y + (pos.center?.y ?? (pos.height / 2))), offset)

    const create = async (data: { libraryUuid: string, uuid: string }) => {
        const comp = await eda.sch_PrimitiveComponent.create(data,
            to2(x),
            to2(y),
            undefined, pos.rotate
        );

        if (!comp) throw new Error("Component not found");
        eda.sys_Message.showToastMessage(`Component ${component.designator} place at ${x} ${y}`, ESYS_ToastMessageType.SUCCESS);

        return comp as ISCH_PrimitiveComponent | ISCH_PrimitiveComponent_2;
    };

    if (partUuid === 'GND') {
        comp = await create({
            libraryUuid: 'f5af0881d090439f925343ec8aedf154',
            uuid: '181f479f152643bbaa46a4b8cd92ed2e',
        });

        comp.setState_Name(component.value || "GND");
        comp.setState_OtherProperty({
            "Global Net Name": component.value || "GND"
        });
    }
    else if (partUuid === 'VCC') {
        comp = await create({
            libraryUuid: 'f5af0881d090439f925343ec8aedf154',
            uuid: '4e5977e7f049493cbf5b5f91190144d3',
        });

        comp.setState_Name(component.value || "VCC");
        comp.setState_OtherProperty({
            "Global Net Name": component.value || "VCC"
        });
    }
    else {
        comp = await create({
            libraryUuid: 'lcsc',
            uuid: partUuid
        });

        comp.setState_Designator(designator);
    }

    return comp;
}

async function getPrimitiveComponentPins(id: string) {
    const pins = await eda.sch_PrimitiveComponent.getAllPinsByPrimitiveId(id);
    if (!pins) throw new Error("Pins not found");

    return pins.sort((a, b) => {
        const aNum = Number(a.getState_PinNumber());
        const bNum = Number(b.getState_PinNumber());
        return aNum - bNum;
    });
}

async function placeComponents(components: CircuitAssembly['components'], offset: Offset = { x: 0, y: 0 }): Promise<PlacedComponents> {
    const placedComponentsP = components.map(async (component) => {
        const { part_uuid: partUuid, designator } = component;
        if (!partUuid) return undefined;

        try {
            const placedComponent: ISCH_PrimitiveComponent | ISCH_PrimitiveComponent_2 = await createComponet(component, offset);

            const primitive_id = placedComponent.getState_PrimitiveId();

            const pins = await getPrimitiveComponentPins(primitive_id);

            await placedComponent.done();

            return { primitive_id, pins, designator };
        } catch (err) {
            eda.sys_Message.showToastMessage(`Component error ${designator}: ${(err as any).message}`, ESYS_ToastMessageType.ERROR);
            return undefined;
        }
    });

    const placedComponents = await Promise.all(placedComponentsP);

    return Object.fromEntries(placedComponents.filter(Boolean).map((component) => [component?.designator, component]));
}

function filterUniqueCoordinatePairs(arr: number[]) {
    const seen = new Set();
    const result = [];

    for (let i = 0; i < arr.length; i += 2) {
        const x = arr[i];
        const y = arr[i + 1];

        // Проверяем, что пара существует (защита от нечётной длины)
        if (y === undefined) break;

        const key = `${x},${y}`;
        if (!seen.has(key)) {
            seen.add(key);
            result.push(x, y);
        }
    }

    return result;
}

const findPin = async (designator: string, pin_: unknown, placeComponents: PlacedComponents, useSchComps = true) => {
    const searchComponentInSCH = async (designator: string) => {
        const components = await eda.sch_PrimitiveComponent.getAll();
        return components.find(c => c.getState_Designator()?.includes(designator));
    }

    const pinNumber = Number(pin_);

    let pins: ISCH_PrimitiveComponentPin[] = [];
    let isExternal = false;
    let component: ISCH_PrimitiveComponent | ISCH_PrimitiveComponent_2 | undefined;

    if (placeComponents[designator]?.pins) {
        component = await eda.sch_PrimitiveComponent.get(placeComponents[designator].primitive_id);
        pins = placeComponents[designator].pins;
    }
    else if (useSchComps) {
        isExternal = true;
        component = await searchComponentInSCH(designator);
        pins = component ? await getPrimitiveComponentPins(component?.getState_PrimitiveId()) : []
    }

    let pin: ISCH_PrimitiveComponentPin | undefined;

    if (pinNumber === 1 && pins.length === 1) pin = pins[0];
    else pin = pins.find(p => Number(p.getState_PinNumber()) === pinNumber)

    if (!pin) return null;

    return { pin: pin, isExternal, component };
};

// eslint-disable-next-line complexity
async function drawEdges(edges: CircuitAssembly['edges'], components: CircuitAssembly['components'], placeComponents: PlacedComponents, offset: Offset = { x: 0, y: 0 }) {
    const pointToArr = (p: any) => {
        const { x, y } = applyOffset(p.x, p.y, offset);
        return [x, -y];
    }

    const searchSignalName = (designator: string, pin: any) => {
        return components
            .find(comp => comp.designator === designator)?.pins?.find(p => Number(pin) === Number(p.pin_number))?.signal_name;
    }

    const getPinPos = (srcpin: Awaited<ReturnType<typeof findPin>>, defaultP: any) => {
        const srcPinPos = {
            x: srcpin?.pin?.getState_X() ?? 0,
            y: srcpin?.pin?.getState_Y() ?? 0,
        }

        if (!srcpin) {
            const [x, y] = pointToArr(defaultP);

            srcPinPos.x = x;
            srcPinPos.y = y;
        }

        return srcPinPos;
    }

    for (const edge of edges) {
        for (const section of edge.sections) {
            const [sdesignator, spin] = section?.incomingShape?.split?.("_pin_") ?? ['', ''];
            const [tdesignator, tpin] = section?.outgoingShape?.split?.("_pin_") ?? ['', ''];;

            let signalName = searchSignalName(sdesignator, spin);
            if (!signalName) signalName = searchSignalName(tdesignator, tpin);

            const netName = signalName ?? 'unknown net';

            const srcpin = await findPin(sdesignator, spin, placeComponents);
            const trgpin = await findPin(tdesignator, tpin, placeComponents);

            if (!srcpin) eda.sys_Message.showToastMessage(`Wire error not found pin: ${spin} ${sdesignator}`, ESYS_ToastMessageType.ERROR);
            if (!trgpin) eda.sys_Message.showToastMessage(`Wire error not found pin: ${tpin} ${tdesignator}`, ESYS_ToastMessageType.ERROR);

            const srcPinPos = getPinPos(srcpin, section.startPoint);
            const trgPinPos = getPinPos(trgpin, section.endPoint);

            const srcpx = srcPinPos.x;
            const srcpy = srcPinPos.y;
            const trgpx = trgPinPos.x;
            const trgpy = trgPinPos.y;

            let values: number[] = [srcpx, srcpy];

            if ("bendPoints" in section) {
                for (const bend of section.bendPoints ?? []) {
                    const [x, y] = pointToArr(bend);
                    // values.push(x, y);

                    const merge = (a: number, b: number) => Math.abs(a - b) <= 5 ? b : a;
                    values.push(merge(merge(x, srcpx), trgpx), merge(merge(y, srcpy), trgpy));
                }
            }

            values.push(trgpx, trgpy);
            values = values.map(x => to2(x));

            for (let i = 0; i < values.length; i += 2) {
                if (values.length <= i + 3) continue;
                if (values[i] !== values[i + 2] && values[i + 1] !== values[i + 3]) {
                    const d1 = Math.abs(values[i] - values[i + 2]);
                    const d2 = Math.abs(values[i + 1] - values[i + 3]);
                    if (d1 < d2) {
                        values = [...values.slice(0, i + 2), values[i + 2], values[i + 1], ...values.slice(i + 2)];
                    } else {
                        values = [...values.slice(0, i + 2), values[i], values[i + 3], ...values.slice(i + 2)];
                    }
                }
            }

            values = filterUniqueCoordinatePairs(values);

            try {
                await eda.sch_PrimitiveWire.create(values, netName);
            } catch (err) {
                eda.sys_Message.showToastMessage(`Wire error: ${(err as any).message} ${JSON.stringify(values)} ${netName} ${section.incomingShape} -> ${section.outgoingShape}`, ESYS_ToastMessageType.ERROR);
            }
        }
    }

}

const getPageSize = async () => {
    try {
        const page = await eda.dmt_Schematic.getCurrentSchematicPageInfo();
        if (!page) return { width: 1200, height: 800 };
        const width = Object.entries(page.titleBlockData).find(([key]) => key.toLowerCase() === 'width');
        const height = Object.entries(page.titleBlockData).find(([key]) => key.toLowerCase() === 'height');
        return { width: Number(width?.[1]?.value ?? 1200), height: Number(height?.[1]?.value ?? 800) };
    } catch (error) {
        return { width: 1200, height: 800 };
    }
}

async function palceNet(nets: CircuitAssembly['added_net'], placeComponents: PlacedComponents) {
    if (!nets) return;

    for (const net of nets) {
        const pin = await findPin(net.designator, net.pin_number, placeComponents);
        if (!pin) {
            eda.sys_Message.showToastMessage(`Not found pin in placenet: ${net.designator} ${net.pin_number}`, ESYS_ToastMessageType.ERROR);
            continue;
        }

        const wireLength = 20;

        const pinX = pin.pin.getState_X();
        const pinY = pin.pin.getState_Y();

        let startX = pinX;
        let startY = pinY;
        let endX = pinX;
        let endY = pinY;

        const rot = pin.pin.getState_Rotation();

        if (rot >= 270) {
            endY = pinY + wireLength;
        }
        else if (rot >= 180) {
            endX = pinX - wireLength;
        }
        else if (rot >= 90) {
            endY = pinY - wireLength;
        }
        else if (rot >= 0) {
            endX = pinX + wireLength;
        }

        try {
            await eda.sch_PrimitiveWire.create([startX, startY, endX, endY], net.net);
        } catch (err) {
            eda.sys_Message.showToastMessage(`Wire error: ${(err as any).message}`, ESYS_ToastMessageType.ERROR);
        }
    }
}

export async function assembleCircuit(circuit: CircuitAssembly) {
    eda.sys_Message.showToastMessage(`Assemble circuit...`, ESYS_ToastMessageType.INFO);
    const pageSize = await getPageSize();
    const root = (circuit.blocks_rect ?? []).find(block => block.name === 'block___v_root__');

    const offset: Offset = { x: 0, y: 0 };

    const otions = {
        centered: (circuit as any).assembly_options?.centered ?? true
    };

    if (root)
        if (otions.centered) {
            offset.x = (pageSize.width - root.width) / 2;
            offset.y = ((pageSize.height - root.height) / 2) + root.height;
        }
        else {
            offset.y = root.height;
            offset.x = undefined;
        }


    const placedComp = await placeComponents(circuit.components, offset);

    // eda.sys_MessageBox.showInformationMessage(JSON.stringify(placedComp, null, 2))

    await drawEdges(circuit.edges, circuit.components, placedComp, offset);
    await palceNet(circuit.added_net ?? [], placedComp);

    for (const block of circuit.blocks_rect ?? []) {
        if (block.name === 'block___v_root__') continue;
        const padding = 5;

        const { x, y } = applyOffset(block.x - padding, block.y - padding, offset)

        await eda.sch_PrimitiveRectangle.create(x, y, block.width + (padding * 2), block.height + (padding * 2), 2);

        const descArr = chunkArray(block.description.split(' '), 8).map(arr => arr.join(' '))
        const desc = descArr.join('\n');

        await eda.sch_PrimitiveText.create(x, y + 3 + (5 * descArr.length), desc, undefined, undefined, undefined, 5)

        await eda.sch_PrimitiveText.create(x, y + 18 + (5 * descArr.length), block.name, undefined, undefined, undefined, 14);

    }

    eda.sys_Message.showToastMessage(`Assemble complete.`, ESYS_ToastMessageType.SUCCESS);
}
