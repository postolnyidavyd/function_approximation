//основна функція
export function computeLagrange(points, m = 500) {
    const n = points.length;
    const xMin = points[0].x;
    const xMax = points[n - 1].x;

    //крок між точками
    const h = (xMax - xMin) / (m - 1);

    const L = buildLagrange(points);

    const plotX = [];
    const plotY = [];

    for (let i = 0; i < m; i++) {
        const x = xMin + i * h;
        plotX.push(x);
        plotY.push(L(x));
    }

    return { plotX, plotY };
}


// Підпрограма що рахує всі знаменники та повертає функцію що рахує значення для переданого x
export function buildLagrange(points) {
    const n = points.length;

    // знаменики
    const denominators = [];
    for (let i = 0; i < n; i++) {
        let den = 1;
        for (let j = 0; j < n; j++) {
            if (j !== i) {
                den *= (points[i].x - points[j].x);
            }
        }
        denominators.push(den);
    }


    return function L(x) {
        let result = 0;
        for (let i = 0; i < n; i++) {
            let num = 1;
            for (let j = 0; j < n; j++) {
                if (j !== i) {
                    num *= (x - points[j].x);
                }
            }
            result += points[i].y * (num / denominators[i]);
        }
        return result;
    };
}

