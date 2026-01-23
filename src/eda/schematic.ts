import type { ExplainCircuit } from '../types/circuit';

// Безопасное извлечение чисел из строк
function safeParseInt(str: string, fallback = 0): number {
    const num = parseInt(str, 10);
    return isNaN(num) ? fallback : num;
}

// Вспомогательная функция: парсинг Allegro-нетлиста
function parseAllegroNetlist(netlistText: string) {
    netlistText = netlistText.replaceAll('\r', '').replaceAll('\n\n', '\n').replaceAll(" ,\n", " ");

    const lines = netlistText.split('\n');
    const signalToPins = new Map<string, string[]>(); // 'VCC' => ['R1.1', 'C2.2', ...]
    let inNetsSection = false;

    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed === '$NETS') {
            inNetsSection = true;
            continue;
        }
        if (trimmed.startsWith('$') && trimmed !== '$NETS') {
            inNetsSection = false;
            continue;
        }
        if (!inNetsSection || !trimmed || trimmed.startsWith(';')) continue;

        // Пример строки: 'VCC_12V' ; H7.1 R7.1 R9.1
        const match = trimmed.match(/^['"]?(.*?)['"]?\s*;\s*(.*)$/);
        if (!match) continue;

        const signalName = match[1].trim();
        const pinRefs = match[2]
            .split(/\s+/)
            .map(p => p.trim())
            .filter(Boolean);

        signalToPins.set(signalName, pinRefs);
    }

    // Обратный маппинг: "R1.1" => "VCC"
    const pinToSignal = new Map<string, string>();
    for (const [signal, pinList] of signalToPins) {
        for (const pinRef of pinList) {
            pinToSignal.set(pinRef, signal);
        }
    }

    return pinToSignal;
}

export async function getSchematic(primitiveIds?: string[]) {
    // 1. Получаем нетлист как строку

    const netlistText: string = await eda.sch_Netlist.getNetlist(ESYS_NetlistType.ALLEGRO);
    const pinToSignal = parseAllegroNetlist(netlistText);
    console.log("[getSchematic] Parsed netlist, total pins:", pinToSignal.entries());

    const components: Promise<ExplainCircuit['components'][0]>[] = [];
    // const components: ExplainCircuit['components'][0][] = [];

    if (!primitiveIds) {
        primitiveIds = await eda.sch_SelectControl.getAllSelectedPrimitives_PrimitiveId();
    }

    for (const id of primitiveIds) {
        const component = await eda.sch_PrimitiveComponent.get(id).catch(_ => null);

        if (!component || component.getState_PrimitiveType() !== ESCH_PrimitiveType.COMPONENT) {
            console.error(`[getSchematic] Error Processing component`, component);
            continue;
        }

        const designator = component.getState_Designator() ?? '';

        if (!designator.trim()) {
            console.error(`[getSchematic] Error Processing component`);
            continue;
        }

        let value: string | null = null;

        const name = component.getState_Name() ?? '';

        if (name.includes("Manufacturer Part")) {
            value = component.getState_ManufacturerId() ?? '';
        }
        else if (name.includes("Value")) {
            value = component.getState_OtherProperty()?.Value?.toString() ?? null;
        }
        else if (name[0] !== '=') {
            value = name;
        }

        if (!value) {
            value = component.getState_ManufacturerId() ?? '';
        }

        const pins: ExplainCircuit['components'][0]['pins'] = [];

        console.log(`[getSchematic] Processing component: ${designator}, Value: ${value}`);
        const rawPins = await eda.sch_PrimitiveComponent.getAllPinsByPrimitiveId(component.getState_PrimitiveId())

        if (Array.isArray(rawPins)) {
            for (const p of rawPins) {
                const rawNum = p.getState_PinNumber();
                const pinNumber = safeParseInt(rawNum, 0);
                const pinName = p.getState_PinName();

                // Сопоставление: "R7.1" → сигнал
                const pinRef = `${designator}.${pinNumber}`;
                const signalName = pinToSignal.get(pinRef) || '';
                console.log(`[getSchematic]   Pin: ${pinRef}, Name: ${pinName}, Signal: ${signalName}`);

                pins.push({
                    pin_number: pinNumber,
                    name: pinName,
                    signal_name: signalName,
                });
            }
        }

        // components.push({
        //     designator,
        //     value: value ?? 'none',
        //     pins,
        //     part_uuid: component.getState_Component().uuid,
        //     pos: {
        //         x: component.getState_X(),
        //         y: component.getState_Y()
        //     }
        // });

        components.push(new Promise((resolve) => {
            const supplierId = component.getState_SupplierId()?.toString();
            const query = supplierId ?? component.getState_SubPartName()?.toString() ?? component.getState_ManufacturerId()?.toString();
            if (!query) {
                eda.sys_Message.showToastMessage(`Fail get component ${designator}`, ESYS_ToastMessageType.ERROR);
                return;
            }

            const part_uuid = eda.lib_Device.search(query).then(devices => devices.find(d => d.supplierId === supplierId)?.uuid ?? null).catch(() => null);

            part_uuid.then(part_uuid => {
                resolve({
                    designator,
                    value: value ?? 'none',
                    pins,
                    part_uuid,
                    pos: {
                        x: component.getState_X(),
                        y: component.getState_Y()
                    }
                });
            })
        }))
    }

    // const explainCircuit: ExplainCircuit = { components };
    const explainCircuit: ExplainCircuit = { components: await Promise.all(components) };

    return explainCircuit;
}