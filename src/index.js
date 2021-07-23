function eval () {
	// Do not use eval!!!
	return;
}

// удаляем пробелы
function removeSpace ( str ) {
	return str.replace ( /\s/ig, '' );
}

// проверка на парные скобки
function checkBrackets ( str ) {
	// получаем все скобки
	const brackets = str.match ( /[\(\)]/gm );

	if ( brackets ) {
		return brackets.reduce ( ( prev, curr ) => {
			if ( curr === '(' ) {
				return prev + 1;
			}

			if ( curr === ')' ) {
				return prev - 1;
			}

			return prev;
		}, 0 );
	}

	return 0;
}

// функция считает длинные значения сложения и вычитания 2+3+3+2-4
function calc ( expr ) {

	let chars = `${ expr }`.split ( "" );
	let n = [];
	let op = [];
	let index = 0;
	let oplast = true;

	n[index] = "";

	// Parse the expression
	for ( let i = 0; i < chars.length; i++ ) {
		if ( isNaN ( +chars[i] ) && chars[i] !== "." && !oplast ) {
			op[index] = chars[i];
			index++;
			n[index] = "";
			oplast = true;
		} else {
			n[index] += chars[i];
			oplast = false;
		}
	}

	// Calculate the expression
	expr = parseFloat ( n[0] );
	for ( let i = 0; i < op.length; i++ ) {
		let num = parseFloat ( n[i + 1] );
		switch ( op[i] ) {
			case "+":
				expr = expr + num;
				break;
			case "-":
				expr = expr - num;
				break;
			case "*":
				expr = expr * num;
				break;
			case "/":
				expr = expr / num;
				break;
		}
	}

	if ( expr === Infinity ) {
		throw 'TypeError: Division by zero.';
	} else {
		return expr;
	}
}

// проверяет наличие * и /
function hasMulDev ( str ) {
	const re = /((^-)?((?<=[-+*(\/])-)?\d+(\.\d+)?)[\*\/](((?<=[-+*(\/])-)?\d+(\.\d+)?)/gm;
	return str.match ( re );
}

// считает умножение и деление
const replaceMulDev = ( str ) => {
	let exp = str;
	const isMulDev = hasMulDev(exp);
	if ( isMulDev ) {
		isMulDev.forEach ( item => {
			exp = `${ exp }`.replace ( item, calc ( item ) );

			if ( hasMulDev(exp) ) {
				exp = replaceMulDev ( exp );
			}
		} );
	}

	return calc ( exp );
}

// считает содержимое в скобках
const calcBrackets = ( exp ) => {
	const hasBrackets = exp.match ( /(\((?:\[??[^\(]*?\)))/gm );

	if ( hasBrackets ) {
		const res = hasBrackets.reduce ( ( prev, curr ) => {
			prev[curr] = replaceMulDev ( curr.replace ( /[\(\)]/gm, '' ) );
			return prev;
		}, {} );

		for ( let key in res ) {
			exp = exp.replace ( key, res[key] );
		}
	} else {
		return exp;
	}
	return exp;
}

// если есть скобки в выражении вернет выражение если нет то null
function hasBracket ( exp ) {
	return exp.match ( /(\((?:\[??[^\(]*?\)))/gm );
}

function expressionCalculator ( expression ) {
	// проверка на парные скобки
	if ( checkBrackets ( expression ) !== 0 ) {
		throw 'ExpressionError: Brackets must be paired';
	}

	// удаляет все пробелы в строке
	let exp = removeSpace ( expression );

	// пока в выражении есть скобки считать все содержимое скобок
	while ( hasBracket ( exp ) ) {
		exp = calcBrackets ( exp );
	}

	const result = replaceMulDev ( exp ).toFixed ( 4 );

	return parseFloat ( result );
}

module.exports = {
	expressionCalculator
}
