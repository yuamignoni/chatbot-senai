import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🧹 Limpando banco...');
    await prisma.holerite.deleteMany();
    await prisma.registroPonto.deleteMany();
    await prisma.solicitacaoFerias.deleteMany();
    await prisma.salario.deleteMany();
    await prisma.funcionarioBeneficio.deleteMany();
    await prisma.beneficio.deleteMany();
    await prisma.funcionario.deleteMany();

    console.log('👨‍💼 Criando funcionário administrador...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.funcionario.create({
        data: {
            nome: 'Admin Master',
            email: 'admin@empresa.com',
            senha_hash: adminPassword,
            cpf: '12345678900',
            data_nascimento: new Date('1985-01-01'),
            data_contratacao: new Date('2020-01-01'),
            cargo: 'Diretor de TI',
            departamento: 'Tecnologia',
            role: 'admin',
            ativo: true,
        },
    });

    console.log('💸 Criando benefícios padrão...');
    const beneficios = await prisma.beneficio.createMany({
        data: [
            { nome: 'Vale Alimentação', tipo: 'alimentação', valor_padrao: 500 },
            { nome: 'Vale Refeição', tipo: 'alimentação', valor_padrao: 400 },
            { nome: 'Plano de Saúde', tipo: 'saúde', valor_padrao: 350 },
            { nome: 'Vale Transporte', tipo: 'transporte', valor_padrao: 300 },
            { nome: 'Auxílio Creche', tipo: 'família', valor_padrao: 250 },
        ],
    });

    const beneficiosCriados = await prisma.beneficio.findMany();

    const funcionarios = [];

    console.log('👷‍♂️ Criando funcionários e seus dados...');
    for (let i = 0; i < 50; i++) {
        const senha_hash = await bcrypt.hash('senha123', 10);

        const funcionario = await prisma.funcionario.create({
            data: {
                nome: faker.person.fullName(),
                email: faker.internet.email(),
                senha_hash,
                cpf: faker.string.numeric(11),
                data_nascimento: faker.date.birthdate({ min: 20, max: 60, mode: 'age' }),
                data_contratacao: faker.date.past({ years: 5 }),
                cargo: faker.person.jobTitle(),
                departamento: faker.commerce.department(),
                role: 'usuario',
            },
        });

        // Salário
        const salario = await prisma.salario.create({
            data: {
                funcionario_id: funcionario.id,
                salario_base: faker.number.float({ min: 1800, max: 12000, fractionDigits: 2 }),
                data_inicio: funcionario.data_contratacao,
                ativo: true,
            },
        });

        // Holerite atual
        await prisma.holerite.create({
            data: {
                funcionario_id: funcionario.id,
                salario_id: salario.id,
                mes: new Date().getMonth() + 1,
                ano: new Date().getFullYear(),
                horas_trabalhadas_minutos: 160 * 60,
                horas_extras_minutos: faker.number.int({ min: 0, max: 10 }) * 60,
                valor_horas_extras: faker.number.float({ min: 100, max: 800, fractionDigits: 2 }),
                descontos: faker.number.float({ min: 100, max: 500, fractionDigits: 2 }),
                beneficios: faker.number.float({ min: 200, max: 800, fractionDigits: 2 }),
                salario_liquido: salario.salario_base,
                data_pagamento: new Date(),
            },
        });

        // Benefícios
        const beneficiosSelecionados = faker.helpers.arrayElements(beneficiosCriados, faker.number.int({ min: 1, max: 3 }));
        for (const beneficio of beneficiosSelecionados) {
            await prisma.funcionarioBeneficio.create({
                data: {
                    funcionario_id: funcionario.id,
                    beneficio_id: beneficio.id,
                    valor: beneficio.valor_padrao ?? 300,
                    data_inicio: funcionario.data_contratacao,
                },
            });
        }

        // Registros de ponto dos últimos 10 dias úteis
        for (let j = 0; j < 10; j++) {
            const dia = faker.date.recent({ days: 30 });
            const diaBase = new Date(dia);

            // Definir horários de entrada e saída
            const entrada = new Date(diaBase);
            entrada.setHours(8, faker.number.int({ min: 0, max: 45 }), 0, 0);

            const saida = new Date(diaBase);
            saida.setHours(17, faker.number.int({ min: 0, max: 60 }), 0, 0);

            await prisma.registroPonto.create({
                data: {
                    funcionario_id: funcionario.id,
                    data: diaBase,
                    hora_entrada: entrada,
                    hora_saida: saida,
                    horas_trabalhadas_minutos: 8 * 60,
                },
            });
        }

        // Solicitações de férias (1 ou 2)
        const qtdFerias = faker.number.int({ min: 1, max: 2 });
        for (let f = 0; f < qtdFerias; f++) {
            const inicio = faker.date.future({ years: 1 });
            const fim = new Date(inicio);
            fim.setDate(inicio.getDate() + 15);
            const status = faker.helpers.arrayElement(['aprovado', 'pendente', 'negado']);

            await prisma.solicitacaoFerias.create({
                data: {
                    funcionario_id: funcionario.id,
                    data_inicio: inicio,
                    data_fim: fim,
                    dias_solicitados: 15,
                    status,
                    aprovado_por_id: status === 'aprovado' ? admin.id : null,
                    motivo_negacao: status === 'negado' ? 'Período indisponível' : null,
                },
            });
        }

        funcionarios.push(funcionario);
    }

    console.log(`✅ ${funcionarios.length} funcionários criados com dados completos!`);
}

main()
    .then(() => {
        console.log('🌱 Seed finalizado com sucesso!');
        return prisma.$disconnect();
    })
    .catch((err) => {
        console.error('Erro ao rodar seed:', err);
        return prisma.$disconnect().finally(() => process.exit(1));
    });