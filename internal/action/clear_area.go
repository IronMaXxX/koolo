package action

import (
	"log/slog"

	"github.com/hectorgimenez/d2go/pkg/data"
	"github.com/hectorgimenez/d2go/pkg/data/area"
	"github.com/hectorgimenez/koolo/internal/context"
	"github.com/hectorgimenez/koolo/internal/game"
	"github.com/hectorgimenez/koolo/internal/pather"
)

func ClearAreaAroundPlayer(radius int, filter data.MonsterFilter) error {
	return ClearAreaAroundPosition(context.Get().Data.PlayerUnit.Position, radius, filter)
}

func ClearAreaAroundPosition(pos data.Position, radius int, filter data.MonsterFilter) error {
	ctx := context.Get()
	ctx.ContextDebug.LastAction = "ClearAreaAroundPosition"
	ctx.Logger.Debug("Clearing area around character...", slog.Int("radius", radius))

	return ctx.Char.KillMonsterSequence(func(d game.Data) (data.UnitID, bool) {
		for _, m := range d.Monsters.Enemies(filter) {
			monsterDistance := pather.DistanceFromPoint(pos, m.Position)
			attackDistance := radius

			// Hack the attack distance only for Chaos Sanctuary run
			if ctx.Data.PlayerUnit.Area == area.ChaosSanctuary && IsMonsterSealElite(m) && ctx.CharacterCfg.Game.Diablo.AttackFromDistance != 0 {
				attackDistance = ctx.CharacterCfg.Game.Diablo.AttackFromDistance
			}

			targetPos := ctx.PathFinder.GetSafePositionTowardsMonster(ctx.Data.PlayerUnit.Position, m.Position, attackDistance)

			if targetPos != ctx.Data.PlayerUnit.Position {
				if err := MoveToCoords(targetPos); err != nil {
					ctx.Logger.Warn("Failed to move to safe position",
						slog.String("error", err.Error()),
						slog.Any("monster", m.Name),
						slog.Any("position", targetPos))
				}
			}

			if monsterDistance <= attackDistance && ctx.Data.AreaData.IsWalkable(m.Position) {
				return m.UnitID, true
			}
		}

		return 0, false
	}, nil)
}
