import { Compiler } from 'webpack';
import { TraceableConfig, ThundraSourceCodeInstrumenter } from '@thundra/instrumenter';

const path = require('path');
const TRACE_DEF_SEPERATOR: string = '.';

export class ThundraWebpackPlugin {
    sourceCodeInstrumenter: ThundraSourceCodeInstrumenter;

    constructor(traceableDefinitions: string[]) {
        const traceableConfigs = traceableDefinitions.map((val) => TraceableConfig.fromString(val));
        this.sourceCodeInstrumenter = new ThundraSourceCodeInstrumenter(traceableConfigs);
    }

    apply(compiler: Compiler): void {
        compiler.hooks.compilation.tap(this.constructor.name, (compilation) => {
            compilation.hooks.succeedModule.tap(this.constructor.name, (module: any) => {
                const filename = module.userRequest;
                if (!filename) {
                    return;
                }
                const relPath = path.relative(process.cwd(), filename);
                let relPathWithDots = relPath.replace(/\//g, TRACE_DEF_SEPERATOR);
                relPathWithDots = relPathWithDots.replace('.js', '');

                if (this.sourceCodeInstrumenter.shouldTraceFile(relPathWithDots)) {
                    const originalSourceCode = module._source._value;
                    try {
                        const instrumentedSourceCode = this.sourceCodeInstrumenter.addTraceHooks(
                            originalSourceCode,
                            relPathWithDots,
                            false,
                        );
                        module._source._value = instrumentedSourceCode;
                    } catch (err) {
                        module._source._value = originalSourceCode;
                    }
                }
            });
        });
    }
}
