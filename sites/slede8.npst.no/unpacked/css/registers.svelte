<script type="ts">;
import DynamicValue from "./dynamic-value.svelte";
export let runtime;
$: instruction =
    (runtime.memory[runtime.pc + 1] << 8) | runtime.memory[runtime.pc];
</script>

<table>
	<tbody>
		<tr>
			<th>flag</th>
			<td colspan="3">
				<DynamicValue
					flashOnUpdate
					format="flag"
					value={runtime.flag ? 1 : 0} />
			</td>
		</tr>
		<tr>
			<th>pc</th>
			<td colspan="3">
				<DynamicValue flashOnUpdate format="address" value={runtime.pc} />
			</td>
		</tr>
		<tr>
			<th>*pc</th>
			<td colspan="3">
				<DynamicValue flashOnUpdate format="instruction" value={instruction} />
			</td>
		</tr>
		<tr>
			<td class="separator" colspan="4" />
		</tr>
		{#each [...Array(8).keys()] as index (index)}
			<tr>
				<th>r{index}</th>
				<td>
					<DynamicValue
						flashOnUpdate
						format="byte"
						value={runtime.regs[index]} />
				</td>
				<th>r{8 + index}</th>
				<td>
					<DynamicValue
						flashOnUpdate
						format="byte"
						value={runtime.regs[8 + index]} />
				</td>
			</tr>
		{/each}
	</tbody>
</table>

<style>
	th {
		text-align: right;
		background: var(--primaryColor);
		color: var(--backgroundColor);
		border: 1px solid var(--primaryColor);
		padding: 0.2em 0.5em;
		text-align: center;
		width: 6ch;
	}
	td {
		border: 1px solid var(--primaryColor);
		padding: 0 0.5em;
		text-align: right;
	}
	td.separator {
		border: 0;
		height: 1em;
	}
</style>
