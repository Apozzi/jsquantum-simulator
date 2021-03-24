import Qubit from "./Qubit";
const math = require('mathjs');


export default class QuantumLogicGateTrasform {

    private static readonly invSqrt = 1 / Math.sqrt(2);

    public static readonly identityMatrix = [[1, 0], [0, 1]];
    public static readonly hadamartMatrix = [
        [QuantumLogicGateTrasform.invSqrt, 
        QuantumLogicGateTrasform.invSqrt], 
        [QuantumLogicGateTrasform.invSqrt, 
        -QuantumLogicGateTrasform.invSqrt]
    ];
    public static readonly pauliXMatrix = [[0, 1], [1, 0]];
    public static readonly pauliYMatrix = [[0, math.complex(0, -1)], [math.complex(0, 1), 0]];;
    public static readonly pauliZMatrix = [[1, 0], [0, -1]];
    public static readonly phaseMatrix = [[1, 0], [0, math.complex(0, 1)]];

    public static createInputVectorFromQubits(qubits: Array<Qubit>): number[][] {
        let result : number[][] = [[1]];
        qubits.forEach(qubit => {
            result = this.tensorProduct(result, [[qubit.getAlpha()], [qubit.getBeta()]]);
        });
        return result;
    }

    public static transform(inputVector: number[][], gateMatrixArray: number[][][]) : number[][] {
        let transformationMatrix : number[][] = [[1]];
        gateMatrixArray.reverse().forEach(gateMatrix => {
            transformationMatrix = this.tensorProduct(transformationMatrix, gateMatrix);
        });
        return this.vectorByMatrixMultiplication(inputVector, transformationMatrix);
    }

    private static vectorByMatrixMultiplication(inputVector: number[][], matrix: number[][]) : number[][] {
        let result: number[][] = Array.from({length: matrix.length}, e => Array(inputVector[0].length).fill(0));
        for (let iy = 0; iy < matrix.length; iy++) {
            inputVector[iy].forEach(function (vx, key) {
                for (let ix = 0; ix < matrix.length; ix++) {
                    result[ix][key] = math.add(result[ix][key], math.multiply(vx, matrix[iy][ix])) 
                }
            });
        }
        return result;
    }

    private static measureQubit(qubit: Qubit) : number {
        return math.abs(math.pow(qubit.getBeta(), 2));
    }

    private static tensorProduct(q1: number[][], q2: number[][]): number[][] {
        const result : number[][] = [];
        for (let qv1 of q1) {
            for (let qv2 of q2) {
                let columnValues = [];
                for (let qv1c of qv1) {
                    for (let qv2c of qv2) {
                        columnValues.push(math.multiply(qv1c, qv2c));
                    }
                }
                result.push(columnValues);
            }
        }
        return result;
    }

   
 
}
